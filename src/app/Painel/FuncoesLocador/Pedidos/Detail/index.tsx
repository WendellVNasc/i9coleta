// BIBLIOTECAS REACT
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Card, Checkbox, Col, Drawer, Image, Input, Modal, Row, Tag, Typography, message } from "antd";

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

const PedidosDetalhes = ({ type, path, permission } : PageDefaultProps) => {

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
            { title: 'Detalhes' }
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
                                <Col xs={24} md={10} style={{overflow: 'hidden !important'}}>
                                    <Row gutter={[2,2]}>
                                        <Col span={4}>
                                            <Row gutter={[2,2]}>
                                                { order.PRODUTO.GALLERY.map((v:any, i:any) => (
                                                    <Col span={24} key={i}><Image preview={false} src={v.URL} width={'100%'} style={{cursor: 'pointer', borderRadius: '8px'}} onClick={() => setImage(v.URL)} /></Col>
                                                )) }
                                            </Row>
                                        </Col>
                                        <Col span={20}><Image src={image} width={'100%'} style={{borderRadius: '8px'}} /></Col>
                                    </Row>
                                </Col>
                                <Col xs={24} md={14}>
                                    <Typography className="cacamba-name">Modelo {order.PRODUTO.STATIONARY_BUCKET_TYPE_NAME}</Typography>
                                    
                                    <Row gutter={[8,8]}>
                                        <Col md={8} xs={24}>                                            
                                            <Typography className="cacamba-title">Estoque</Typography>
                                            <Typography className="cacamba-desc"><span>{order.PRODUTO.STOCK_PROVIDER}</span> cacambas</Typography>
                                            <Typography className="cacamba-title">Quantidade pedida</Typography>
                                            <Typography className="cacamba-desc"><span>{order.QTDE}</span> cacambas</Typography>
                                        </Col>
                                        <Col md={8} xs={12}>
                                            <Typography className="cacamba-title">Detalhes</Typography>
                                            <Typography className="cacamba-desc"><span>Tipo de tampa:</span> {order.PRODUTO.TYPE_LID_NAME}</Typography>
                                            <Typography className="cacamba-desc"><span>Cor:</span> {order.PRODUTO.COLOR}</Typography>
                                            <Typography className="cacamba-desc"><span>Material:</span> {order.PRODUTO.MATERIAL}</Typography>
                                        </Col>
                                        <Col md={8} xs={12}>
                                            <Typography className="cacamba-title">Dimensões</Typography>
                                            <Typography className="cacamba-desc"><span>Comprimento:</span> {order.PRODUTO.STATIONARY_BUCKET_TYPE_LETTER_A_NAME}</Typography>
                                            <Typography className="cacamba-desc"><span>Largura:</span> {order.PRODUTO.STATIONARY_BUCKET_TYPE_LETTER_B_NAME}</Typography>
                                            <Typography className="cacamba-desc"><span>Altura:</span> {order.PRODUTO.STATIONARY_BUCKET_TYPE_LETTER_C_NAME}</Typography>
                                        </Col>
                                    </Row>

                                    <Typography className="cacamba-title">Tipo de locação</Typography>
                                    <Row gutter={[8,8]}>
                                        { order.TYPE_LOCAL === 'E' ? <Col><Tag className={`mf-tag active`}>Locação Externa | até {order.DAYS} dias</Tag></Col> : null }
                                        { order.TYPE_LOCAL === 'I' ? <Col><Tag className={`mf-tag active`}>Locação Interna | até {order.DAYS} dias</Tag></Col> : null }
                                    </Row>

                                    <Typography className="cacamba-title">Endereço de entrega</Typography>
                                    <Typography className="cacamba-address">{order.ADDRESS?.STREET}, {order.ADDRESS?.NUMB} - {order.ADDRESS?.DISTRICT} - {order.ADDRESS?.CITY_NAME} / {order.ADDRESS?.STATE_ACRONYM}</Typography>

                                    <Row gutter={[8,8]}>
                                        <Col md={8} xs={24}>
                                            <Typography className="cacamba-title">Valor do pedido</Typography>
                                            <Typography className="cacamba-desc"><span>{order.PRICE_TOTAL_NAME}</span></Typography>
                                        </Col>
                                        <Col md={8} xs={24}>
                                            <Typography className="cacamba-title">Valor à receber</Typography>
                                            <Typography className="cacamba-desc"><span>{order.PRICE_TOTAL_NAME}</span></Typography>
                                        </Col>
                                    </Row>

                                    <Typography className="cacamba-title">Caçambas</Typography>
                                    { order.STATUS === 'AR' ? <Typography className="cacamba-address" onClick={onOpen}>Selecionar caçambas</Typography> : null}
                                    { order.STATUS === 'AR' ? order.CACAMBAS_SELECIONADAS.map((v:any, i:any) => <Typography key={i} className="cacamba-desc"><span>{v.CODE}</span> - Aguardando confirmação do pedido</Typography>) : null }
                                    { order.STATUS === 'PA' ? order.CACAMBAS_SELECIONADAS.map((v:any, i:any) => <Typography key={i} className="cacamba-desc"><span>{v.CODE}</span> - {v.STATUS_NAME}</Typography>) : null }
                                    
                                </Col>

                                { order.STATUS === 'AR' ? (
                                    <Col md={{offset: 12, span: 12}} xs={{offset: 0, span: 24}}>
                                        <Row gutter={[8,8]}>
                                            <Col md={12} xs={12}>
                                                <Button type="default" shape="round" block onClick={onRecuse} loading={load}>Recusar pedido</Button>
                                            </Col>
                                            <Col md={12} xs={12}>
                                                <Button disabled={ Number(order.CACAMBAS_SELECIONADAS.length) !== Number(order.QTDE) } type="primary" shape="round" block onClick={onAccept} loading={load}>Aceitar pedido</Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                ) : null }

                            </Row>
                        </CardItem>
                    </Col>

                    <Drawer open={open} onClose={onOpen} title="Selecionar caçambas">
                        <Row gutter={[8,16]}>
                            <Col span={24}>
                                <Input prefix={<IoSearch color="var(--color02)" />} size="large" placeholder="Buscar caçamba" value={search} onChange={(v) => setSearch(v.target.value)} />
                            </Col>
                            { loadButton ? <Col span={24}><LoadItem type='alt' /></Col> : cacamba.length > 0 ? cacamba.map((v, i) => (
                                <Col span={24} key={i}>
                                    <Card size='small' hoverable>
                                        <Checkbox disabled={ Number(verify) >= Number(order.QTDE) && !Boolean(cacambaSelect?.[v.ID]) } defaultChecked={ cacambaSelect?.[v.ID] } onChange={(value) => onCacambaSelect(v.ID, value)}><Typography className={`ad-title`}>{v.CODE}</Typography></Checkbox>
                                    </Card>
                                </Col>
                            )) : <Col span={24}><Typography>Não há mais caçambas</Typography></Col> }
                            <Col span={24}>
                                <Button disabled={ verify < order.QTDE } onClick={onOrderProduct} block type='primary' loading={loadSelect}>Selecionar caçambas</Button>
                            </Col>
                        </Row>
                    </Drawer>

                </Row>
            ) }
        </PageDefault>
    )

}

export default PedidosDetalhes;