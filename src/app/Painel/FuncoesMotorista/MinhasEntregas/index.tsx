// BIBLIOTECAS REACT
import { useEffect, useState } from "react";
import { Alert, Button, Col, Modal, Radio, Row, Tag, Typography, Upload, message } from "antd";
import ImgCrop from 'antd-img-crop';

// SERVIÇOS
import { POST_API, POST_CATCH, PageDefaultProps, UPLOAD_API, getToken } from "../../../../services";

// COMPONENTES
import PageDefault from "../../../../components/PageDefault";
import CardItem from "../../../../components/CardItem";
import Table from "../../../../components/Table";
import LoadItem from "../../../../components/LoadItem";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { Scanner } from "@yudiel/react-qr-scanner";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

// GOOGLE MAPS
import google from '../../../../assets/images/google-maps.png';

const MinhasEntregas = ({ type, path, permission } : PageDefaultProps ) => {

    // ESTADOS DO COMPONENTE
    const [ typeLoad, setTypeLoad ] = useState<any>(null);
    const [ action, setAction ] = useState(false);
    const [ modal, setModal ] = useState(false);
    const [ photoModal, setPhotoModal ] = useState(false);
    const [ loadMap, setLoadMap ] = useState(false);
    const [ coord, setCoord ] = useState<any>(null)
    const [ myCoord, setMyCoord ] = useState<any>(null)
    const [ product, setProduct ] = useState<any[]>([])
    const [ fileList, setFileList ] = useState<any[]>([])
    const [ productSelect, setProductSelect ] = useState<any>(null)

    const onProduct = (item:any) => {
        
        var temp = product
        
        if ( temp.filter((v) => Number(v.ID) === Number(item.ID)).length > 0 ) {
            message.warning({content: 'Caçamba já selecionada', key: '09op'})
        } else {
            temp.push(item)
        }
        
        setProduct(temp)

    }

    const onDelProduct = (item:any) => {
        
        var temp = product
        
        if ( temp.filter((v) => Number(v.ID) === Number(item.ID)).length > 0 ) {
            temp.splice(temp.indexOf(item), 1)
        }

        setProduct(temp)

    }

    const onLoadMap = () => setLoadMap(!loadMap)

    // DEFINE COLUNAS DA TABELA
    const column = [
        { title: 'Data Entrega', dataIndex: 'DATETIME_DELIVERY_FORMAT', table: 'order_location_product.DATETIME_DELIVERY', width: '180px', sorter: true, align: 'center', render: (item:any) => (
            <Row style={{width: '100%'}}>
                <Col span={24}>
                    <Typography style={{textAlign: 'center'}}>{item.DATETIME_DELIVERY_FORMAT}</Typography>
                    <Typography style={{textAlign: 'center', color: 'var(--color02)'}}>{ product.filter((v) => Number(v.ID) === Number(item.ID)).length > 0 ? 'Selecionada' : 'Não Selecionada' }</Typography>
                </Col>
            </Row>
        ) },
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
        { title: 'Veículo', dataIndex: 'CODE', table: 'stationary_bucket.CODE', width: '180px', sorter: false, align: 'center', render: (item:any) => (
            <Row justify={'center'} style={{width: '100%'}}>
                <Typography>{item.VEHICLE_PLATE} - {item.VEHICLE_TYPE_NAME}</Typography>
            </Row>
        ) }
    ]

    // CARREGA DADOS
    const load = () => {
        POST_API('/credential/search.php', { token: getToken(), type: 'self' }).then(rs => rs.json()).then(res => {
            if (res.return) {
                setCoord([ res.data.LATITUDE, res.data.LONGITUDE ])
            }
            loadDelivery()
        }).catch(POST_CATCH)
    }

    const reader = (result:any) => {
        if (typeLoad === 'EP') {
            POST_API(`/${path}/search.php`, { token: getToken(), filter: JSON.stringify({ STATUS: 'EP', USE_DRIVER: true, CODE: result[0].rawValue }), type: 'self' }).then(rs => rs.json()).then(res => {
                if (res.data !== null) {
                    onProduct(res.data)
                    onModal()
                    message.success({content: 'Caçamba selecionada', key: '09op'})
                } else {
                    message.error({content: 'Caçamba não encontrada', key: '09op'})
                }
            }).catch(POST_CATCH)
        } else {
            if ( result[0].rawValue === productSelect?.CODE ) {
                onModal()
                onPhotoModal()
            } else {
                message.error({content: 'Caçamba inválida', key: '09op'})
            }
        }
    }

    const onSend = () => {

        POST_API('/order_location/initial.php', { token: getToken(), master: JSON.stringify({PRODUCTS: product}) }).then(rs => rs.json()).then(res => {
            if (res.return) {
                setProduct([])
                setAction(!action)
                loadDelivery()
            } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
        }).catch(POST_CATCH)

    }

    const onFinish = () => {

        POST_API('/order_location/finish.php', { token: getToken(), master: JSON.stringify({PRODUCT: productSelect, PHOTOS: fileList, MYCOORD: myCoord}) }).then(rs => rs.json()).then(res => {
            if (res.return) {
                onPhotoModal()
                loadDelivery()
                Modal.success({ title: 'Sucesso', content: res.msg })
                setAction(!action)
            } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
        }).catch(POST_CATCH)

    }

    const loadDelivery = () => {
        POST_API(`/${path}/search.php`, { token: getToken(), filter: JSON.stringify({ STATUS: 'ETL', USE_DRIVER: true }), type: 'list' }).then(rs => rs.json()).then(res => {
            if (res.data.length > 0) {
                setTypeLoad('ETL')
                setProduct(res.data)
            } else {
                setTypeLoad('EP')
                setProduct([])
            }
        }).catch(POST_CATCH)
    }

    const onModal = () => setModal(!modal)
    const onPhotoModal = () => setPhotoModal(!photoModal)

    useEffect(() => {
        load()
        navigator.geolocation.getCurrentPosition((position) => setMyCoord([position.coords.latitude, position.coords.longitude]));
    }, [])

    useEffect(() => {
        onLoadMap()
    }, [ coord, myCoord, product, productSelect ])

    return (
        <PageDefault valid={`${permission}.${type}`} items={[
            { title: 'Entregas Agendadas' }
        ]}>
            { typeLoad ? (
                <Row gutter={[16,16]}>
                    { typeLoad === 'ETL' ? (
                        <Col span={24}>
                            <Alert message="Entrega iniciada" type="info" showIcon description="Finalize a entrega para iniciar outra." />
                        </Col>
                    ) : null }
                    <Col xs={24} md={16}>
                        <CardItem>
                            { coord && myCoord ? loadMap ?
                                <MapContainer center={[Number(myCoord[0]), Number(myCoord[1])]} zoom={14} scrollWheelZoom={false} style={{width:'100%',height:330}}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <CircleMarker center={[Number(coord[0]), Number(coord[1])]} pathOptions={{ color: 'blue'}} radius={10}>
                                        <Popup> Minha empresa </Popup>
                                    </CircleMarker>
                                    <CircleMarker center={[Number(myCoord[0]), Number(myCoord[1])]} pathOptions={{ color: 'green'}} radius={10}>
                                        <Popup> Meu local </Popup>
                                    </CircleMarker>
                                    { product.map((v, i) => (
                                        <CircleMarker key={i} center={[Number(v.ORDER_LATITUDE), Number(v.ORDER_LONGITUDE)]} pathOptions={{ color: productSelect?.ID === v.ID ? 'var(--color01)' : 'gray'}} radius={10}>
                                            <Popup> {v.ADDRESS} </Popup>
                                        </CircleMarker>
                                    )) }
                                </MapContainer>
                            : 
                                <MapContainer center={[Number(myCoord[0]), Number(myCoord[1])]} zoom={14} scrollWheelZoom={false} style={{width:'100%',height:330}}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <CircleMarker center={[Number(coord[0]), Number(coord[1])]} pathOptions={{ color: 'blue'}} radius={10}>
                                        <Popup> Minha empresa </Popup>
                                    </CircleMarker>
                                    <CircleMarker center={[Number(myCoord[0]), Number(myCoord[1])]} pathOptions={{ color: 'green'}} radius={10}>
                                        <Popup> Meu local </Popup>
                                    </CircleMarker>
                                    { product.map((v, i) => (
                                        <CircleMarker key={i} center={[Number(v.ORDER_LATITUDE), Number(v.ORDER_LONGITUDE)]} pathOptions={{ color: productSelect?.ID === v.ID ? 'var(--color01)' : 'gray'}} radius={10}>
                                            <Popup> {v.ADDRESS} </Popup>
                                        </CircleMarker>
                                    )) }
                                </MapContainer>
                            : <LoadItem type="alt" />}
                            { productSelect?.ADDRESS ? <Link to={`http://maps.google.com/?daddr=${productSelect?.ADDRESS}`} target="_blank"><img src={google} className="img-google"/></Link> : null }
                        </CardItem>
                    </Col>
                    <Col xs={24} md={8}>
                        <CardItem title={`${typeLoad === 'EP' ? 'Iniciar entrega' : 'Entrega iniciada' } | ${product.length} selecionado(s)`}>
                            <Radio.Group onChange={(v) => setProductSelect(v.target.value)} style={{width: '100%'}} value={productSelect}>
                                <Row gutter={[8,8]} style={{width: '100%'}}>
                                    { product.map((v:any, i:any) => (
                                        <Col span={24} key={i} style={{display: 'flex'}}>
                                            { typeLoad === 'ETL' ? <Radio value={v} /> : null }
                                            <Typography>{v.CODE}</Typography>
                                            { typeLoad === 'EP' ? <IoClose style={{position: 'absolute', right: '0.4em', top: '0.4em', cursor: 'pointer'}} onClick={() => onDelProduct(v)} /> : null }
                                        </Col>  
                                    )) }
                                    { typeLoad === 'EP' ? (
                                        <>
                                            <Col span={12}>
                                                <Button type="default" block onClick={onModal}>Ler QRcode</Button>
                                            </Col>
                                            <Col span={12}>
                                                <Button type="primary" block disabled={!(product.length > 0)} onClick={onSend}>Iniciar</Button>
                                            </Col>
                                        </>
                                    ) : (
                                        <Col span={24}>
                                            <Button type="primary" block onClick={onModal} disabled={!(productSelect?.ID > 0)}>Confirmar entrega</Button>
                                        </Col>
                                    )}
                                </Row>
                            </Radio.Group>
                        </CardItem>
                    </Col>
                    <Col md={24} xs={24}>
                        <CardItem>
                            <Table
                                column={column}
                                path={path}
                                type={type}
                                action={action}
                                defaultFilter={{ STATUS: 'EP', USE_DRIVER: true }}
                            />
                        </CardItem>
                    </Col>
                    <Modal open={modal} onCancel={onModal} footer={false} closable={false} destroyOnClose>
                        <Scanner onScan={reader} styles={{container: { height: 472 }}}/>
                        <Typography style={{textAlign: 'center', fontSize: '1.4em', marginTop: '1em', color: 'var(--color02)'}}> { typeLoad === 'EP' ? `${product.length} caçamba(s) selecionado(s)` : `Confirmar entrega de ${productSelect?.CODE}`}</Typography>
                    </Modal>
                    <Modal open={photoModal} onCancel={onPhotoModal} footer={false} closable={false} destroyOnClose>
                        <Row gutter={[8,8]}>
                            <Col span={24}>
                                <ImgCrop modalTitle="Editar imagem" modalOk="Ok" modalCancel="Cancelar">
                                    <Upload action={UPLOAD_API} listType="picture" onChange={({ fileList: newFileList }) => { setFileList(newFileList)}}>
                                        <Button block type="default">Selecionar fotos</Button>
                                    </Upload>
                                </ImgCrop>
                            </Col>
                            <Col span={12}>
                                <Button type="default" block onClick={onPhotoModal}>Cancelar</Button>
                            </Col>
                            <Col span={12}>
                                <Button type="primary" block disabled={!(fileList.length > 0)} onClick={onFinish}>Finalizar entrega</Button>
                            </Col>
                        </Row>
                    </Modal>
                </Row>
            ) : <Row><Col span={24}><LoadItem /></Col></Row> }
        </PageDefault>
    )

}

export default MinhasEntregas;