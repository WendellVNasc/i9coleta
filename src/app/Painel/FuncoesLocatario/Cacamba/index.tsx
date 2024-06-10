// BIBLIOTECAS REACT
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar, Button, Carousel, Col, Image, Input, Modal, Rate, Row, Spin, Tag, Typography } from "antd";

// COMPONENTES
import PageDefault from "../../../../components/PageDefault";
import CardItem from "../../../../components/CardItem";
import LoadItem from "../../../../components/LoadItem";
import CardCacamba from "../../../../components/CardCacamba";
import ModalFiltros from "../../../../components/ModalFiltros";

// SERVIÇOS
import { POST_API, getToken } from "../../../../services";

// CSS
import './style.css'

// ICONES
import { IoFilter, IoSearch, IoStar, } from "react-icons/io5";
import DrawerEndereco from "../../../../components/DrawerEndereco";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { ThreeCircles } from "react-loader-spinner";

const PedirCacambaCacamba = () => {

    // RESPONSAVEL PELA ROTA
    const navigate = useNavigate()
    
    const { ID } = useParams()

    const [ cacamba, setCacamba ] = useState<any>(null)
    const [ typeLocal, setTypeLocal ] = useState<'E'|'I'|''>('')
    const [ address, setAddress ] = useState<any>(null)
    const [ load, setLoad ] = useState<boolean>(false)
    const [ image, setImage ] = useState<any>(null)

    const [ edit, setEdit ] = useState<boolean>(false)
    const [ compare, setCompare ] = useState<number>(1)

    const [ qtde, setQtde ] = useState<number>(1)

    const [ open, setOpen ] = useState<boolean>(false)

    const onOpen = () => setOpen(!open)

    // CARREGA MODELO
    const onView = () => {
        POST_API('/stationary_bucket_group/search_locatario.php', { token: getToken(), filter: JSON.stringify({ ID: ID }), type: 'view', qtde: qtde }).then(rs => rs.json()).then(res => {
            setCacamba(res.data[0])
            setImage(res.data[0].GALLERY[0].URL)
        })
    } 

    // VERIFICA CARRINHO
    const onCart = () => {
        POST_API('/cart/product_view.php', { token: getToken(), ID: ID }).then(rs => rs.json()).then(res => {
            if (res.return) {
                setAddress(res.data.ADDRESS)
                setTypeLocal(res.data.TYPE_LOCAL)
                setQtde(Number(res.data.QTDE))
                setEdit(true)
                setCompare(0)
            }
        })
    } 


    const onAdd = () => {
        if (address === null || typeLocal === '' || load) return false;
        
        setLoad(true)
        if (edit) {
            POST_API('/cart/update-product.php', { token: getToken(), master: JSON.stringify({ PRODUCT_ID: ID, ADDRESS_ID: address?.ID, TYPE_LOCAL: typeLocal, QTDE: qtde }), type: 'add' }).then(rs => rs.json()).then(res => {
                if (res.return) {
                    navigate('/painel/carrinho')
                } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
            }).finally(() => setLoad(false))
        } else {
            POST_API('/cart/save-product.php', { token: getToken(), master: JSON.stringify({ PRODUCT_ID: ID, ADDRESS_ID: address?.ID, TYPE_LOCAL: typeLocal, QTDE: qtde }), type: 'add' }).then(rs => rs.json()).then(res => {
                if (res.return) {
                    navigate('/painel/carrinho')
                } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
            }).finally(() => setLoad(false))
        }
    }

    useEffect(onView, [ID, qtde])
    useEffect(onCart, [ID])

    return (
        <PageDefault valid={true} items={[
            { title: <Link to="/painel/pedircacamba">Pedir Caçamba</Link>, },
            { title: 'Caçamba' }
        ]}>
            { cacamba === null ? <LoadItem /> : (
                <Row gutter={[8,8]}>
                    <Col span={24}>
                        <CardItem>
                            <Row gutter={[16,8]}>
                                <Col xs={24} md={10} style={{overflow: 'hidden !important'}}>
                                    <Row gutter={[2,2]}>
                                        <Col span={4}>
                                            <Row gutter={[2,2]}>
                                                { cacamba.GALLERY.map((v:any, i:any) => (
                                                    <Col span={24} key={i}><Image preview={false} src={v.URL} width={'100%'} style={{cursor: 'pointer', borderRadius: '8px'}} onClick={() => setImage(v.URL)} /></Col>
                                                )) }
                                            </Row>
                                        </Col>
                                        <Col span={20}><Image src={image} width={'100%'} style={{borderRadius: '8px'}} /></Col>
                                    </Row>
                                </Col>
                                <Col xs={24} md={14}>
                                    <Typography onClick={() => navigate(`/painel/pedircacamba/fornecedor/${cacamba.CREDENTIAL_ID}`)} className='card-cacamba-title'>{String(cacamba.PROVIDER_NAME).toLocaleUpperCase()}</Typography>
                                    <Typography className="cacamba-name">Modelo {cacamba.STATIONARY_BUCKET_TYPE_NAME}</Typography>
                                    <div className="cacamba-rate"> <Rate disabled style={{marginRight: 4}}/> (0) </div>
                                    
                                    <Row gutter={[8,8]}>
                                        <Col md={9} xs={12}>
                                            <Typography className="cacamba-title">Detalhes</Typography>
                                            <Typography className="cacamba-desc"><span>Tipo de tampa:</span> {cacamba.TYPE_LID_NAME}</Typography>
                                            <Typography className="cacamba-desc"><span>Cor:</span> {cacamba.COLOR}</Typography>
                                            <Typography className="cacamba-desc"><span>Material:</span> {cacamba.MATERIAL}</Typography>
                                        </Col>
                                        <Col md={9} xs={12}>
                                            <Typography className="cacamba-title">Dimensões</Typography>
                                            <Typography className="cacamba-desc"><span>Comprimento:</span> {cacamba.STATIONARY_BUCKET_TYPE_LETTER_A_NAME}</Typography>
                                            <Typography className="cacamba-desc"><span>Largura:</span> {cacamba.STATIONARY_BUCKET_TYPE_LETTER_B_NAME}</Typography>
                                            <Typography className="cacamba-desc"><span>Altura:</span> {cacamba.STATIONARY_BUCKET_TYPE_LETTER_C_NAME}</Typography>
                                        </Col>
                                        <Col md={6} xs={24}>                                            
                                            <Typography className="cacamba-title">Disponíveis</Typography>
                                            <Typography className="cacamba-desc">{cacamba.STOCK} cacambas</Typography>
                                            <Typography className="cacamba-link" style={{marginTop: 6}}>Ficha Técnica</Typography>
                                        </Col>
                                    </Row>

                                    <Typography className="cacamba-title">Tipo de locação</Typography>
                                    <Row gutter={[8,8]}>
                                        { cacamba.TYPE_LOCAL === 'B' || cacamba.TYPE_LOCAL === 'E' ? <Col><Tag className={`mf-tag ${typeLocal === 'E' ? 'active' : ''}`} onClick={() => setTypeLocal('E')}>Locação Externa | até {cacamba.DAYS_EXTERNAL} dias</Tag></Col> : null }
                                        { cacamba.TYPE_LOCAL === 'B' || cacamba.TYPE_LOCAL === 'I' ? <Col><Tag className={`mf-tag ${typeLocal === 'I' ? 'active' : ''}`} onClick={() => setTypeLocal('I')}>Locação Interna | até {cacamba.DAYS_INTERNAL} dias</Tag></Col> : null }
                                    </Row>

                                    <Typography className="cacamba-title">Endereço de entrega</Typography>
                                    { address === null ? (
                                        <Typography className="cacamba-address" onClick={onOpen}>Selecionar endereço</Typography>
                                    ) : (
                                        <Typography className="cacamba-address" onClick={onOpen}>{address?.STREET}, {address?.NUMB} - {address?.DISTRICT} - {address?.CITY_NAME} / {address?.STATE_ACRONYM}</Typography>
                                    ) }

                                    { cacamba.STOCK > 0 ? (
                                        <Row gutter={[16,16]} className="cacamba-footer" align={'middle'}>
                                            <Col md={12} xs={8}>
                                                <Row gutter={[22,22]} align={'middle'} justify={'end'}>
                                                    <Col style={{height: 14}}><FaMinus className={`cacamba-plus ${qtde === compare ? 'disabled' : ''}`} onClick={() => setQtde(qtde === compare ? qtde : qtde-1)} /></Col>
                                                    <Col><Typography className="cacamba-qtde">{qtde}</Typography></Col>
                                                    <Col style={{height: 14}}><FaPlus className={`cacamba-plus ${qtde < Number(cacamba.STOCK) ? '' : 'disabled'}`} onClick={() => setQtde(qtde < Number(cacamba.STOCK) ? qtde+1 : qtde)} /></Col>
                                                </Row>
                                            </Col>
                                            <Col md={12} xs={16}>
                                                <div className={`carrinho-button ${ address === null || typeLocal === '' ? 'disabled' : '' }`} onClick={onAdd}>
                                                    <Typography className="carrinho-button-text">{ load ? <ThreeCircles visible={true} height="20" width="20" color={"#fff"} ariaLabel="grid-loading" wrapperClass="grid-wrapper" /> : edit ? (qtde > 0 ? 'Atualizar' : 'Remover') : 'Adicionar' }</Typography>
                                                    <Typography className="carrinho-button-text">{ typeLocal === 'E' ? cacamba.PRICE_EXTERNAL_NAME : typeLocal === 'I' ? cacamba.PRICE_INTERNAL_NAME : 'R$ 0,00' }</Typography>
                                                </div>
                                            </Col>
                                        </Row>
                                    ) : null }
                                    
                                </Col>
                            </Row>
                        </CardItem>
                    </Col>
                    <DrawerEndereco open={open} close={() => setOpen(false)} address={address} setAddress={setAddress} />
                </Row>
            ) }
        </PageDefault>
    )

}

export default PedirCacambaCacamba;