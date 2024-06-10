// BIBLIOTECAS REACT
import { useEffect, useState } from "react";
import { Col, Modal, Row, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";

// SERVIÇOS
import { POST_API, POST_CATCH, getToken } from "../../../services";

// COMPONENETES
import PageDefault from "../../../components/PageDefault";
import CardItem from "../../../components/CardItem";
import LoadItem from "../../../components/LoadItem";
import CardCacamba from "../../../components/CardCacamba";

// ICONES
import { IoChevronForward } from "react-icons/io5";
import { FaBarcode, FaCreditCard, FaDollarSign, FaMoneyBillTransfer, FaPix } from "react-icons/fa6";

// CSS
import './styles.css'


const Carrinho = () => {

    // RESPONSAVEL PELA ROTA
    const navigate = useNavigate()

    // ESTADOS DO COMPONENTE
    const [ load, setLoad ] = useState<boolean>(true);
    const [ loadFinish, setLoadFinish ] = useState<boolean>(false);
    const [ cart, setCart ] = useState<any[]>([]);
    const [ total, setTotal ] = useState<string>('R$ 0,00');

    // CARREGA DADOS
    const loadCart = () => {
        setLoad(true)
        POST_API('/cart/products.php', { token: getToken() }).then(rs => rs.json()).then(res => {
            if (res.return) {
                setCart(res.data)
                setTotal(res.total)
            }
        }).catch(POST_CATCH).finally(() => setLoad(false))
    }

    const onFinish = () => {
        setLoadFinish(true)
        POST_API('/cart/create-order.php', { token: getToken() }).then(rs => rs.json()).then(res => {
            if (res.return) { 
                navigate('/painel/')
                Modal.success({ title: 'Sucesso', content: res.msg })
            } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
        }).catch(POST_CATCH).finally(() => setLoadFinish(false))
    }

    useEffect(() => {
        loadCart()
    }, [])

    return (
        <PageDefault valid={true} items={[
            { title: 'Carrinho' },
        ]}>
            { load ? <LoadItem /> : loadFinish ? <LoadItem title="Enviando pedido" /> :
                <Row gutter={[16,16]} className="mp-row">
                    <Col xs={24} md={17}>
                        <CardItem title="Meu carrinho">
                            <Row gutter={[8,8]}>
                                { cart.length > 0 ? cart.map((v:any, i:any) => (
                                    <Col key={i} span={24}><CardCacamba item={v} type="cart" /></Col>
                                )) : <Col span={24}><Typography>Nenhum produto adicionado.</Typography></Col>}
                                <Col span={24}>
                                    <Typography className="cr-total">Valor total: <span>{total}</span></Typography>
                                </Col>
                            </Row>
                        </CardItem>
                    </Col>
                    <Col xs={24} md={7}>
                        <CardItem title="Formas de Pagamento">
                            <Row gutter={[8,8]}>
                                <Col span={24}> <div className="fdp-div" onClick={onFinish}> <FaDollarSign className="fdp-icon" /> <Typography className="fdp-text">Saldo da conta</Typography> <Tag color="var(--color02)" className="fdp-tag">R$ 0,00</Tag> <IoChevronForward className="fdp-arrow" /> </div> </Col>
                                <Col span={24}> <div className="fdp-div" onClick={onFinish}> <FaMoneyBillTransfer className="fdp-icon" /> <Typography className="fdp-text">Débito online</Typography> <IoChevronForward className="fdp-arrow" /> </div> </Col>
                                <Col span={24}> <div className="fdp-div" onClick={onFinish}> <FaCreditCard className="fdp-icon" /> <Typography className="fdp-text">Cartão de crédito</Typography> <Tag color="var(--color02)" className="fdp-tag">À vista</Tag> <IoChevronForward className="fdp-arrow" /> </div> </Col>
                                <Col span={24}> <div className="fdp-div" onClick={onFinish}> <FaBarcode className="fdp-icon" /> <Typography className="fdp-text">Boleto bancário</Typography> <Tag color="var(--color02)" className="fdp-tag">Até 3 dias úteis</Tag> <IoChevronForward className="fdp-arrow" /> </div> </Col>
                                <Col span={24}> <div className="fdp-div" onClick={onFinish}> <FaPix className="fdp-icon" /> <Typography className="fdp-text">Chave pix</Typography> <IoChevronForward className="fdp-arrow" /> </div> </Col>
                            </Row>
                        </CardItem>
                    </Col>
                </Row>
            }
        </PageDefault>
    )

}

export default Carrinho;