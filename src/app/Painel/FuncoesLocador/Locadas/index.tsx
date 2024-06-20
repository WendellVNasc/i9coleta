// BIBLIOTECAS REACT
import { useEffect, useState } from "react";
import { Button, Col, Form, Image, Input, Modal, Row, Tag, Typography } from "antd";

// SERVIÇOS
import { POST_API, POST_CATCH, PageDefaultProps, getToken } from "../../../../services";

// COMPONENTES
import PageDefault from "../../../../components/PageDefault";
import CardItem from "../../../../components/CardItem";
import Table from "../../../../components/Table";
import LoadItem from "../../../../components/LoadItem";
import SelectSearch from "../../../../components/SelectSearch";
import { TbCamera, TbMapPin, TbMapPinOff } from "react-icons/tb";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

const LocadasList = ({ type, path, permission } : PageDefaultProps ) => {

    // ESTADOS DO COMPONENTE
    const [ action, setAction ] = useState(false);
    const [ loadMap, setLoadMap ] = useState(false);
    const [ modalGallery, setModalGallery ] = useState(false);
    const [ coord, setCoord ] = useState<any>(null)
    const [ product, setProduct ] = useState<any[]>([])
    const [ gallery, setGallery ] = useState<any[]>([])

    const onLoadMap = () => setLoadMap(!loadMap)
    const onModalGallery = () => setModalGallery(!modalGallery)

    // DEFINE COLUNAS DA TABELA
    const column = [
        { title: 'Data Locação', dataIndex: 'DATE_LOCADA_FORMAT', table: 'order_location_product.DATE_LOCADA', width: '180px', sorter: true, align: 'center', render: null },
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
        { title: 'Tempo Restante', dataIndex: 'TIME_LEFT', table: '( order_location.DAYS - DATEDIFF(CURRENT_DATE(), order_location_product.DATE_LOCADA))', width: '180px', sorter: true, align: 'center', render: (item:any) => (
            <Row style={{width: '100%'}}>
                <Col span={24}>
                    <Typography style={{textAlign: 'center', color: item.TIME_LEFT > -1 ? 'green' : 'red'}}>{item.TIME_LEFT} dia(s) de locação</Typography>
                </Col>
            </Row>
        ) },
        { title: 'Motorista / Veículo', dataIndex: 'CODE', table: 'stationary_bucket.CODE', width: '180px', sorter: false, align: 'center', render: (item:any) => (
            <Row justify={'center'} style={{width: '100%'}}>
                { item.DATETIME_DELIVERY ? <Tag color="green">{item.DRIVER_NAME} - {item.DRIVER_CNH}</Tag> : null }
                { item.DATETIME_DELIVERY ? <Tag color="red">{item.VEHICLE_PLATE} - {item.VEHICLE_TYPE_NAME}</Tag> : null }
            </Row>
        ) },
        { title: 'Ações', dataIndex: null, width: '60px', sorter: false, align: 'center', render: (item: any) => (
            <Row justify={'center'} style={{width: '100%'}}>
                <Col><TbCamera size={18} className="actions-button" onClick={() => openGallery(item)}/></Col>
            </Row>
        ) },
    ]

    const openGallery = (item:any) => {
        setGallery([])
        onModalGallery()
        POST_API("/order_location_product_gallery/search.php", { token: getToken(), filter: JSON.stringify({ORDER_LOCATION_PRODUCT_ID: item.ORDER_LOCATION_PRODUCT_ID}) }).then(rs => rs.json()).then((res:any) => {
            setGallery(res.data)
        }).catch(POST_CATCH)
    }

    // CARREGA DADOS
    const load = () => {
        POST_API('/credential/search.php', { token: getToken(), type: 'self' }).then(rs => rs.json()).then(res => {
            if (res.return) {
                setCoord([ res.data.LATITUDE, res.data.LONGITUDE ])
            }
        }).catch(POST_CATCH)
    }

    const onLoadDados = () => {
        POST_API(`/${path}/search.php`, { token: getToken(), filter: JSON.stringify({ STATUS: 'L' }), type: 'list' }).then(rs => rs.json()).then(res => {
            if (res.return) {
                setProduct(res.data)
            }
        }).catch(POST_CATCH)
    }

    useEffect(() => load(), [])
    useEffect(() => onLoadDados(), [])
    useEffect(() => onLoadMap(), [product])

    return (
        <PageDefault valid={`${permission}.${type}`} items={[
            { title: 'Locadas' }
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
                            defaultFilter={{ STATUS: 'L' }}
                        />
                    </CardItem>
                </Col>
            </Row>
            <Modal title="Fotos da locação" open={modalGallery} onCancel={onModalGallery} footer={false}>
                <Row gutter={[8,8]}>
                    { gallery.length === 0 ? <Col span={24}><LoadItem type="alt" /></Col> : gallery.map((v, i) => <Col span={12} key={i}><Image src={v.URL} /></Col>) }
                </Row>
            </Modal>
        </PageDefault>
    )

}

export default LocadasList;