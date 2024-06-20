// BIBLIOTECAS REACT
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Col, Image, Modal, Row, Tag, Typography, message } from "antd";

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
import { TableReturnButton } from "../../../../../components/Table/buttons";

const MeusPedidosDetalhes = ({ type, path, permission } : PageDefaultProps) => {

    // RESPONSAVEL PELA ROTA
    const navigate = useNavigate()
    
    const { ID } = useParams()

    const [ order, setOrder ] = useState<any>(null)
    const [ load, setLoad ] = useState<boolean>(false)
    const [ image, setImage ] = useState<any>(null)

    const [ open, setOpen ] = useState<boolean>(false)

    const onOpen = () => setOpen(!open)

    // CARREGA MODELO
    const onView = () => {
        POST_API(`/${path}/search.php`, { token: getToken(), filter: JSON.stringify({ ID: ID }), type: 'view' }).then(rs => rs.json()).then(res => {
            setOrder(res.data)
            setImage(res.data.PRODUTO.GALLERY[0].URL)
        })
    } 

    // AÇÃO DE CANCELAR
    const onCancel = () => {
        Modal.confirm({
            title: 'Cancelar pedido?', icon: <ExclamationCircleOutlined />, cancelText: 'Não', okText: 'Sim',
            onOk() {
                setLoad(true)
                POST_API(`/${path}/cancel.php`, { token: getToken(), ID: ID }).then(rs => rs.json()).then(res => {
                    if (res.return) {
                        message.success({ content: res.msg, key: 'screen' })
                        navigate('..')
                    } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
                }).catch(POST_CATCH).finally(() => setLoad(false))
            },
            onCancel() {},
        })
    }

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
                                    { order.STATUS === 'PA' ? order.CACAMBAS_SELECIONADAS.map((v:any, i:any) => <Typography key={i} className="cacamba-desc"><span>{v.CODE}</span> - {v.STATUS_NAME}</Typography>) : null }
                                    
                                </Col>

                                { order.STATUS === 'AR' ? (
                                    <Col md={{offset: 18, span: 6}} xs={{offset: 0, span: 24}}>
                                        <Row gutter={[8,8]}>
                                            <Col md={24} xs={24}>
                                                <Button type="default" shape="round" block onClick={onCancel} loading={load}>Cancelar pedido</Button>
                                            </Col>
                                        </Row>
                                    </Col>
                                ) : null }

                            </Row>
                        </CardItem>
                    </Col>

                </Row>
            ) }
        </PageDefault>
    )

}

export default MeusPedidosDetalhes;