// BIBLIOTECAS REACT
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Card, Checkbox, Col, Drawer, Image, Input, Modal, Row, Tag, Typography, message } from "antd";
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';

// COMPONENTES
import PageDefault from "../../../../../components/PageDefault";
import CardItem from "../../../../../components/CardItem";
import LoadItem from "../../../../../components/LoadItem";

// SERVIÇOS
import { POST_API, POST_CATCH, PageDefaultProps, getToken } from "../../../../../services";

// CSS
import './style.css'

// ICONES
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { IoSearch } from "react-icons/io5";
import { TableReturnButton } from "../../../../../components/Table/buttons";
import LoadScriptOnlyIfNeeded from "../../../../../components/LoadScriptOnlyIfNeeded";
import { GoogleMap, Marker as MapMark } from "@react-google-maps/api";
import { MapContainer, Popup, TileLayer, Marker, CircleMarker } from "react-leaflet";

// GOOGLE MAPS
import google from '../../../../../assets/images/google-maps.png';

const PedidosMapa = ({ type, path, permission } : PageDefaultProps) => {

    // RESPONSAVEL PELA ROTA
    const navigate = useNavigate()
    
    const { ID } = useParams()

    const [ order, setOrder ] = useState<any>(null)
    const [ load, setLoad ] = useState<boolean>(false)
    const [ loadButton, setLoadButton ] = useState<any>(true)
    const [ loadSelect, setLoadSelect ] = useState<any>(false)
    const [ image, setImage ] = useState<any>(null)
    const [ search, setSearch ] = useState<any>('')
    const [ cacamba, setCacamba ] = useState<any[]>([])
    const [ cacambaSelect, setCacambaSelect ] = useState<any>(null)
    const [ verify, setVerify ] = useState<number>(0)

    const [ open, setOpen ] = useState<boolean>(false)

    const onOpen = () => setOpen(!open)

    // CARREGA MODELO
    const onView = () => {
        POST_API(`/${path}/search.php`, { token: getToken(), filter: JSON.stringify({ ID: ID }), type: 'view' }).then(rs => rs.json()).then(res => {
            setOrder(res.data)
            setImage(res.data.PRODUTO.GALLERY[0].URL)
            setVerify(Number(res.data.CACAMBAS_SELECIONADAS.length))
            setCacambaSelect(res.data.CACAMBAS_SELECIONADAS_DEFAULT)
        })
    } 

    // AÇÃO DE ACEITE
    const onAccept = () => {
        Modal.confirm({
            title: 'Aceitar pedido?', icon: <ExclamationCircleOutlined />, cancelText: 'Não', okText: 'Sim',
            onOk() {
                setLoad(true)
                POST_API(`/${path}/accept.php`, { token: getToken(), ID: ID }).then(rs => rs.json()).then(res => {
                    if (res.return) {
                        message.success({ content: res.msg, key: 'screen' })
                        navigate('..')
                    } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
                }).catch(POST_CATCH).finally(() => setLoad(false))
            },
            onCancel() {},
        })
    }

    // AÇÃO DE RECUSA
    const onRecuse = () => {
        Modal.confirm({
            title: 'Recusar pedido?', icon: <ExclamationCircleOutlined />, cancelText: 'Não', okText: 'Sim',
            onOk() {
                setLoad(true)
                POST_API(`/${path}/recuse.php`, { token: getToken(), ID: ID }).then(rs => rs.json()).then(res => {
                    if (res.return) {
                        message.success({ content: res.msg, key: 'screen' })
                        navigate('..')
                    } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
                }).catch(POST_CATCH).finally(() => setLoad(false))
            },
            onCancel() {},
        })
    }

    // FUNÇÃO PESQUISAR
    const onSearch = () => {
        setLoadButton(true)
        POST_API(`/stationary_bucket/search.php`, { token: getToken(), filter: JSON.stringify({ STATIONARY_BUCKET_GROUP_ID: order.PRODUCT_ID, STATUS: 'D' }), search: search }).then(rs => rs.json()).then(res => {
            if (res.return) { setCacamba(res.data)} else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
        }).catch(POST_CATCH).finally( () => setLoadButton(false) )
    }

    // FUNÇÃO SELECIONAR
    const onCacambaSelect = (id:number, value:any) => {
        setCacambaSelect({ ...cacambaSelect, [id]: value.target.checked })
        setVerify( value.target.checked ? verify+1 : verify-1 )
    }

    const onOrderProduct = () => {
        if ( !(verify < order.QTDE) ) {
            setLoadSelect(true)
            POST_API(`/${path}/add-product.php`, { token: getToken(), master: JSON.stringify({ ORDER_LOCATION_ID: ID }), prod: JSON.stringify(cacambaSelect) }).then(rs => rs.json()).then(res => {
                if (res.return) {
                    message.success({ content: res.msg, key: 'screen' })
                    setOpen(false)
                    onView()
                } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
            }).catch(POST_CATCH).finally(() => setLoadSelect(false))
        } 
    }

    useEffect(() => {
        if (open) onSearch()
    }, [search, open])

    useEffect(onView, [ID])

    return (
        <PageDefault valid={true} items={[
            { title: <Link to="/painel/pedidoscacamba">Pedidos</Link>, },
            { title: 'Mapa' }
        ]} options={
            <Row justify={'end'} gutter={[8,8]}>
                <TableReturnButton type={'edit'} permission={permission} />
            </Row>
        }>
            { order === null ? <LoadItem /> : (
                <Row gutter={[8,8]}>
                    <Col span={24}>
                        <CardItem>
                            <Row gutter={[16,8]}>
                                <Col xs={24} md={24} style={{overflow: 'hidden !important'}}>
                                    <MapContainer center={[Number(order.ADDRESS.LATITUDE), Number(order.ADDRESS.LONGITUDE)]} zoom={16} scrollWheelZoom={false} style={{width:'100%',height:500}}>
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <CircleMarker center={[Number(order.ADDRESS.LATITUDE), Number(order.ADDRESS.LONGITUDE)]} pathOptions={{ color: 'var(--color01)'}} radius={10}>
                                            <Popup> {order.ADDRESS.STREET}, {order.ADDRESS.NUMB} - {order.ADDRESS.DISTRICT} - {order.ADDRESS.CITY_NAME} / {order.ADDRESS.STATE_ACRONYM} </Popup>
                                        </CircleMarker>
                                    </MapContainer>
                                    <Link to={`http://maps.google.com/?daddr=${order.ADDRESS.STREET}, ${order.ADDRESS.NUMB}, ${order.ADDRESS.DISTRICT}, ${order.ADDRESS.CITY_NAME}, ${order.ADDRESS.STATE_ACRONYM}`} target="_blank"><img src={google} className="img-google"/></Link>
                                </Col>
                            </Row>
                        </CardItem>
                    </Col>

                </Row>
            ) }
        </PageDefault>
    )

}

export default PedidosMapa;