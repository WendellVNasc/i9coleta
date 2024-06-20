// BIBLIOTECAS REACT
import { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Tag, Typography, message } from "antd";

// SERVIÇOS
import { POST_API, POST_CATCH, PageDefaultProps, getToken } from "../../../../services";

// COMPONENTES
import PageDefault from "../../../../components/PageDefault";
import CardItem from "../../../../components/CardItem";
import Table from "../../../../components/Table";
import LoadItem from "../../../../components/LoadItem";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { Scanner } from "@yudiel/react-qr-scanner";
import { IoClose } from "react-icons/io5";

const MinhasCacambas = ({ type, path, permission } : PageDefaultProps ) => {

    // ESTADOS DO COMPONENTE
    const [ typeLoad, setTypeLoad ] = useState<any>('A');
    const [ action, setAction ] = useState(false);
    const [ modal, setModal ] = useState(false);
    const [ loadMap, setLoadMap ] = useState(false);
    const [ coord, setCoord ] = useState<any>(null)
    const [ myCoord, setMyCoord ] = useState<any>(null)
    const [ product, setProduct ] = useState<any[]>([])
    const [ productSelect, setProductSelect ] = useState<any[]>([])

    const onProduct = (item:any) => {
        
        var temp = productSelect
        
        if ( temp.filter((v) => Number(v.ID) === Number(item.ID)).length > 0 ) {
            message.warning({content: 'Caçamba já selecionada', key: '09op'})
        } else {
            temp.push(item)
        }
        
        setProductSelect(temp)

    }

    const onDelProduct = (item:any) => {
        
        var temp = productSelect

        temp =  temp.filter((v) => Number(v.ID) !== Number(item.ID))

        setProductSelect(temp)

    }

    const onLoadMap = () => setLoadMap(!loadMap)

    // DEFINE COLUNAS DA TABELA
    const column = [
        { title: 'Data Pedido', dataIndex: 'DATETIME_UPDATE_FORMAT', table: 'order_location.DATETIME_UPDATE', width: '180px', sorter: true, align: 'center', render: (item:any) => (
            <Row style={{width: '100%'}}>
                <Col span={24}>
                    <Typography style={{textAlign: 'center', color: item.STATUS_COLOR}}>{item.STATUS_NAME}</Typography>
                    <Typography style={{textAlign: 'center'}}>{item.DATETIME_UPDATE_FORMAT}</Typography>
                    <Typography style={{textAlign: 'center', color: 'var(--color02)'}}>{ productSelect.filter((v) => Number(v.ID) === Number(item.ID)).length > 0 ? 'Selecionada' : 'Não Selecionada' }</Typography>
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
        { title: 'Endereço locação', dataIndex: 'ADDRESS', table: 'address_order.STRRET', width: 'auto', minWidth: '300px', sorter: false, align: 'left', render: (item:any) => (
            <Row style={{width: '100%'}}>
                <Col span={24}>
                    <Typography>Pedido: n° {item.ORDER_ID}</Typography>
                    <Typography style={{color: 'var(--color02)'}}>{item.ADDRESS}</Typography>
                </Col>
            </Row>
        ) },
        { title: 'Tempo Restante', dataIndex: 'TIME_LEFT', table: '( order_location.DAYS - DATEDIFF(CURRENT_DATE(), order_location_product.DATE_LOCADA))', width: '180px', sorter: true, align: 'center', render: (item:any) => (
            <Row style={{width: '100%'}}>
                <Col span={24}>
                    { item.STATUS === 'L' ? <Typography style={{textAlign: 'center', color: item.TIME_LEFT > -1 ? 'green' : 'red'}}>{item.TIME_LEFT} dia(s) de locação</Typography> : <Typography style={{textAlign: 'center'}}>Indisponível</Typography> }
                </Col>
            </Row>
        ) },
        { title: 'Dados Locação', width: '180px', sorter: false, align: 'center', render: (item:any) => (
            <Row justify={'center'} style={{width: '100%'}}>
                <Tag>{item.DATETIME_DELIVERY_FORMAT}</Tag>
                <Tag color="green">{item.DRIVER_NAME} - {item.DRIVER_CNH}</Tag>
                <Tag color="red">{item.VEHICLE_PLATE} - {item.VEHICLE_TYPE_NAME}</Tag>
            </Row>
        ) },
        { title: 'Dados Retirada', width: '180px', sorter: false, align: 'center', render: (item:any) => (
            <Row justify={'center'} style={{width: '100%'}}>
                <Tag>{item.DATETIME_RETIRADA_DELIVERY_FORMAT}</Tag>
                <Tag color="green">{item.DRIVER_RETIRADA_NAME} - {item.DRIVER_RETIRADA_CNH}</Tag>
                <Tag color="red">{item.VEHICLE_RETIRADA_PLATE} - {item.VEHICLE_TYPE_RETIRADA_NAME}</Tag>
            </Row>
        ) }
    ]

    const reader = (result:any) => {
        POST_API(`/${path}/search.php`, { token: getToken(), filter: JSON.stringify({ STATUS: 'L', USE_CLIENT: true, CODE: result[0].rawValue }), type: 'self' }).then(rs => rs.json()).then(res => {
            if (res.data !== null) {
                onProduct(res.data)
                onModal()
                message.success({content: 'Caçamba selecionada', key: '09op'})
            } else {
                message.error({content: 'Caçamba não encontrada', key: '09op'})
            }
        }).catch(POST_CATCH)
    }

    const onSend = () => {

        POST_API('/order_location/retirada.php', { token: getToken(), master: JSON.stringify({PRODUCTS: productSelect}) }).then(rs => rs.json()).then(res => {
            if (res.return) {
                setProductSelect([])
                setAction(!action)
            } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
        }).catch(POST_CATCH)

    }

    const onModal = () => setModal(!modal)

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => setMyCoord([position.coords.latitude, position.coords.longitude]));
    }, [])

    useEffect(() => {
        onLoadMap()
    }, [ myCoord, product, productSelect ])

    return (
        <PageDefault valid={`${permission}.${type}`} items={[
            { title: 'Minhas caçambas' }
        ]}>
            { typeLoad ? (
                <Row gutter={[16,16]}>
                    <Col xs={24} md={16}>
                        <CardItem>
                            { myCoord ? loadMap ?
                                <MapContainer center={[Number(myCoord[0]), Number(myCoord[1])]} zoom={14} scrollWheelZoom={false} style={{width:'100%',height:330}}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    { product.map((v, i) => v.STATUS === 'EP' || v.STATUS === 'ETL' ? (
                                        <CircleMarker key={i} center={[Number(v.PROVIDER_LATITUDE), Number(v.PROVIDER_LONGITUDE)]} pathOptions={{ color: v.STATUS_COLOR}} radius={10}>
                                            <Popup> <Typography style={{textAlign: 'center', color: v.STATUS_COLOR, fontSize: '1.2em'}}>{v.STATUS_NAME}</Typography> <br/> {v.ADDRESS} </Popup>
                                        </CircleMarker>
                                    ) :
                                        <CircleMarker key={i} center={[Number(v.ORDER_LATITUDE), Number(v.ORDER_LONGITUDE)]} pathOptions={{ color: v.STATUS_COLOR}} radius={10}>
                                            <Popup> <Typography style={{textAlign: 'center', color: v.STATUS_COLOR, fontSize: '1.2em'}}>{v.STATUS_NAME}</Typography> <br/> {v.ADDRESS} </Popup>
                                        </CircleMarker>
                                    ) }
                                </MapContainer>
                            : 
                                <MapContainer center={[Number(myCoord[0]), Number(myCoord[1])]} zoom={14} scrollWheelZoom={false} style={{width:'100%',height:330}}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    { product.map((v, i) => v.STATUS === 'EP' || v.STATUS === 'ETL' ? (
                                        <CircleMarker key={i} center={[Number(v.PROVIDER_LATITUDE), Number(v.PROVIDER_LONGITUDE)]} pathOptions={{ color: v.STATUS_COLOR}} radius={10}>
                                            <Popup> <Typography style={{textAlign: 'center', color: v.STATUS_COLOR, fontSize: '1.2em'}}>{v.STATUS_NAME}</Typography> <br/> {v.ADDRESS} </Popup>
                                        </CircleMarker>
                                    ) :
                                        <CircleMarker key={i} center={[Number(v.ORDER_LATITUDE), Number(v.ORDER_LONGITUDE)]} pathOptions={{ color: v.STATUS_COLOR}} radius={10}>
                                            <Popup> <Typography style={{textAlign: 'center', color: v.STATUS_COLOR, fontSize: '1.2em'}}>{v.STATUS_NAME}</Typography> <br/> {v.ADDRESS} </Popup>
                                        </CircleMarker>
                                    ) }
                                </MapContainer>
                            : <LoadItem type="alt" />}
                        </CardItem>
                    </Col>
                    <Col xs={24} md={8}>
                        <CardItem title={`Pedir retirada | ${productSelect.length} selecionado(s)`}>
                            <Row gutter={[8,8]} style={{width: '100%'}}>
                                { productSelect.map((v:any, i:any) => (
                                    <Col span={24} key={i} style={{display: 'flex'}}>
                                        <Typography>{v.CODE}</Typography>
                                        <IoClose style={{position: 'absolute', right: '0.4em', top: '0.4em', cursor: 'pointer'}} onClick={() => onDelProduct(v)} />
                                    </Col>  
                                )) }
                                <Col span={12}>
                                    <Button type="default" block onClick={onModal}>Ler QRcode</Button>
                                </Col>
                                <Col span={12}>
                                    <Button type="primary" block disabled={!(productSelect.length > 0)} onClick={onSend}>Pedir retirada</Button>
                                </Col>
                            </Row>
                        </CardItem>
                    </Col>
                    <Col md={24} xs={24}>
                        <CardItem>
                            <Table
                                column={column}
                                path={path}
                                type={type}
                                action={action}
                                getList={setProduct}
                                defaultFilter={{ USE_CLIENT: true }}
                            />
                        </CardItem>
                    </Col>
                    <Modal open={modal} onCancel={onModal} footer={false} closable={false} destroyOnClose>
                        <Scanner onScan={reader} styles={{container: { height: 472 }}}/>
                        <Typography style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', color: 'var(--color02)'}}> {productSelect.length} caçamba(s) selecionado(s)</Typography>
                    </Modal>
                </Row>
            ) : <Row><Col span={24}><LoadItem /></Col></Row> }
        </PageDefault>
    )

}

export default MinhasCacambas;