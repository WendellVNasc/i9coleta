// BIBLIOTECAS REACT
import { useEffect, useState } from "react";
import { Col, Row, Tag, Typography } from "antd";

// SERVIÇOS
import { POST_API, POST_CATCH, PageDefaultProps, getToken } from "../../../../services";

// COMPONENTES
import PageDefault from "../../../../components/PageDefault";
import CardItem from "../../../../components/CardItem";
import Table from "../../../../components/Table";
import LoadItem from "../../../../components/LoadItem";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

const EmTransitoLocacaoList = ({ type, path, permission } : PageDefaultProps ) => {

    // ESTADOS DO COMPONENTE
    const [ action, setAction ] = useState(false);
    const [ loadMap, setLoadMap ] = useState(false);
    const [ coord, setCoord ] = useState<any>(null)
    const [ product, setProduct ] = useState<any[]>([])

    const onLoadMap = () => setLoadMap(!loadMap)

    // DEFINE COLUNAS DA TABELA
    const column = [
        { title: 'Data Pedido', dataIndex: 'DATETIME_UPDATE_FORMAT', table: 'order_location.DATETIME_UPDATE', width: '180px', sorter: true, align: 'center', render: null },
        { title: 'Cliente', dataIndex: 'CLIENT_NAME', table: 'client.NAME', width: 'auto', minWidth: '300px', sorter: false, align: 'left', render: (item:any) => (
            <Row style={{width: '100%'}}>
                <Col span={24}>
                    <Typography>Pedido: n° {item.ORDER_ID}</Typography>
                    <Typography>{item.CLIENT_NAME}</Typography>
                    <Typography style={{color: 'var(--color02)'}}>{item.ADDRESS}</Typography>
                </Col>
            </Row>
        ) },
        { title: 'Código Caçamba', dataIndex: 'CODE', table: 'stationary_bucket.CODE', width: '180px', sorter: true, align: 'center', render: (item:any) => (
            <Row style={{width: '100%'}}>
                <Col span={24}>
                    <Typography style={{textAlign: 'center'}}>{item.CODE}</Typography>
                    <Typography style={{color: 'var(--color02)', textAlign: 'center'}}>Modelo {item.STATIONARY_BUCKET_TYPE_NAME}</Typography>
                </Col>
            </Row>
        ) },
        { title: 'Distância', dataIndex: 'DISTANCE_NAME', width: '180px', sorter: false, align: 'center', render: null },
        { title: 'Data Entrega', dataIndex: 'CODE', table: 'stationary_bucket.CODE', width: '180px', sorter: true, align: 'center', render: (item:any) => (
            <Row justify={'center'} style={{width: '100%'}}>
                <Tag style={{textAlign: 'center'}}>{ item.DATETIME_DELIVERY ? `Agendado para ${item.DATETIME_DELIVERY_FORMAT}` : 'Aguardando agendamento' }</Tag>
                { item.DATETIME_DELIVERY ? <Tag color="green">{item.DRIVER_NAME} - {item.DRIVER_CNH}</Tag> : null }
                { item.DATETIME_DELIVERY ? <Tag color="red">{item.VEHICLE_PLATE} - {item.VEHICLE_TYPE_NAME}</Tag> : null }
            </Row>
        ) }
    ]

    // CARREGA DADOS
    const load = () => {
        POST_API('/credential/search.php', { token: getToken(), type: 'self' }).then(rs => rs.json()).then(res => {
            if (res.return) {
                setCoord([ res.data.LATITUDE, res.data.LONGITUDE ])
            }
        }).catch(POST_CATCH)
    }

    const onLoadDados = () => {
        POST_API(`/${path}/search.php`, { token: getToken(), filter: JSON.stringify({ STATUS: 'ETL' }), type: 'list' }).then(rs => rs.json()).then(res => {
            if (res.return) {
                setProduct(res.data)
            }
        }).catch(POST_CATCH)
    }

    useEffect(() => load(), [])
    useEffect(() => onLoadDados(), [])
    useEffect(() => onLoadMap(), [product])

    return (
        <PageDefault valid={`ffn.vrp`} items={[
            { title: 'Em Trânsito Locação' }
        ]}>
            <Row gutter={[16,16]}>
                <Col xs={24} md={24}>
                    <CardItem>
                        { coord ? loadMap ?
                            <MapContainer center={[Number(coord[0]), Number(coord[1])]} zoom={14} scrollWheelZoom={false} style={{width:'100%',height:330}}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <CircleMarker center={[Number(coord[0]), Number(coord[1])]} pathOptions={{ color: 'blue'}} radius={10}>
                                    <Popup> Minha empresa </Popup>
                                </CircleMarker>
                                { product.map((v, i) => (
                                    <CircleMarker key={i} center={[Number(v.ORDER_LATITUDE), Number(v.ORDER_LONGITUDE)]} pathOptions={{ color: 'var(--color01)'}} radius={10}>
                                        <Popup> {v.ADDRESS} </Popup>
                                    </CircleMarker>
                                )) }
                            </MapContainer>
                        : 
                            <MapContainer center={[Number(coord[0]), Number(coord[1])]} zoom={14} scrollWheelZoom={false} style={{width:'100%',height:330}}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <CircleMarker center={[Number(coord[0]), Number(coord[1])]} pathOptions={{ color: 'blue'}} radius={10}>
                                    <Popup> Minha empresa </Popup>
                                </CircleMarker>
                                { product.map((v, i) => (
                                    <CircleMarker key={i} center={[Number(v.ORDER_LATITUDE), Number(v.ORDER_LONGITUDE)]} pathOptions={{ color: 'var(--color01)'}} radius={10}>
                                        <Popup> {v.ADDRESS} </Popup>
                                    </CircleMarker>
                                )) }
                            </MapContainer>
                        : <LoadItem type="alt" />}
                    </CardItem>
                </Col>
                <Col md={24} xs={24}>
                    <CardItem>
                        <Table
                            column={column}
                            path={path}
                            type={type}
                            action={action}
                            defaultFilter={{ STATUS: 'ETL' }}
                        />
                    </CardItem>
                </Col>
            </Row>
        </PageDefault>
    )

}

export default EmTransitoLocacaoList;