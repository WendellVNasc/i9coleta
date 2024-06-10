// BIBLIOTECAS REACT
import { useEffect, useState } from "react";
import { Button, Col, Input, Modal, Row, Typography } from "antd";
import { useNavigate } from "react-router-dom";

// COMPONENTES
import CardItem from "../../../components/CardItem";
import LoadItem from "../../../components/LoadItem";
import PageDefault from "../../../components/PageDefault";
import CardModel from "../../../components/CardModel";
import CardLocador from "../../../components/CardLocador";
import CardCacamba from "../../../components/CardCacamba";

// ICONES
import { IoFilter, IoSearch } from "react-icons/io5";

// CSS
import './style.css';

// SERVIÇOS
import { POST_API, getToken } from "../../../services";
import ModalFiltros from "../../../components/ModalFiltros";

const PedirCacamba = () => {

    const navigate = useNavigate()

    // ESTADOS DO COMPONENTE
    const [ load, setLoad ] = useState<boolean>(true);
    const [ modal, setModal ] = useState<boolean>(false);
    const [ model, setModel ] = useState<any[]>([]);

    const [ locadoresLoading, setLocadoresLoading ] = useState<boolean>(false);
    const [ locadoresVerMais, setLocadoresVerMais ] = useState<boolean>(true);
    const [ locadoresPage, setLocadoresPage ] = useState<number>(1);
    const [ locadores, setLocadores ] = useState<any[]>([]);

    const [ cacambas, setCacambas ] = useState<any[]>([]);

    // CARREGA MODELOS
    const loadModel = () => {
        POST_API('/stationary_bucket_type/search.php', { token: getToken() }).then(rs => rs.json()).then(res => {
            setModel(res.data)
        })
    }

    // CARREGA LOCADORES
    const loadLocadores = () => {
        setLocadoresLoading(true)
        POST_API('/provider/search.php', { token: getToken(), pagination: JSON.stringify({ current: locadoresPage, total: 0, page: 6 }) }).then(rs => rs.json()).then(res => {
            setLocadores([ ...locadores, ...res.data])
            setLocadoresPage(locadoresPage+1)
            setLocadoresVerMais(!(Number(res.summary.QTDE) === locadores.length ))
        }).finally(() => setLocadoresLoading(false))
    }

    // CARREGA CAÇAMBAS
    const loadCacambas = () => {
        POST_API('/stationary_bucket_group/search_locatario.php', { token: getToken(), filter: JSON.stringify({ STOCK_VALID: true }), pagination: JSON.stringify({ current: 1, total: 0, page: 4 }) }).then(rs => rs.json()).then(res => {
            setCacambas(res.data)
        })
    }

    // MODAL FILTRO
    const onModal = () => {
        setModal(!modal)
    }

    useEffect(() => {

        setLocadores([])

        loadModel()
        loadLocadores()
        loadCacambas()

        setLoad(false)

    }, [])

    return (
        <PageDefault valid={true} items={[
            { title: 'Pedir Caçamba' }
        ]}>
            <Row gutter={[16,16]}>
                <Col md={24} xs={24}>
                    { load ? <LoadItem /> :
                        <Row gutter={[16,16]}>
                            <Col span={24}>
                                <CardItem>
                                    <Input prefix={<IoSearch color="var(--color02)" />} size="large" placeholder="Buscar em todo o i9Coleta" />
                                </CardItem>
                            </Col>
                            <Col span={24}>
                                <CardItem>
                                    <Row gutter={[16,16]} style={{ flexWrap: 'nowrap', overflowY: 'auto' }}>
                                        { model.map((v:any,i:any) => (
                                            <Col key={i} xs={9} md={4}>
                                                <CardModel item={v} />
                                            </Col>
                                        )) }
                                    </Row>
                                </CardItem>
                            </Col>
                            <Col xs={24} md={24}>
                                <CardItem>
                                    <Row gutter={[16,16]}>
                                        <Col span={12}>
                                            <div className="pd-painel externo" onClick={() => navigate('/painel/pedircacamba/tipolocacao/E')}><div className="pd-painel-pele"></div> <Typography className="pd-painel-texto">Locação<br/>Externa</Typography></div>
                                        </Col>
                                        <Col span={12}>
                                            <div className="pd-painel interno" onClick={() => navigate('/painel/pedircacamba/tipolocacao/I')}><div className="pd-painel-pele"></div> <Typography className="pd-painel-texto">Locação<br/>Interna</Typography></div>
                                        </Col>
                                    </Row>
                                </CardItem>
                            </Col>
                            <Col span={24}>
                                <CardItem title="Melhores caçambas disponíveis">
                                    <Button type="link" className="pd-button-card">Ver mais</Button>
                                    <Row gutter={[16,16]}>
                                        { cacambas.map((v:any,i:any) => (
                                            <Col key={i} xs={24} md={12}>
                                                <CardCacamba item={v} type="shop" />
                                            </Col>
                                        )) }
                                    </Row>
                                </CardItem>
                            </Col>
                            <Col span={24}>
                                <CardItem title="Locadores">
                                    <Button onClick={onModal} icon={<IoFilter />} type="link" className="pd-button-card">Filtros</Button>
                                    <Row gutter={[16,16]}>
                                        { locadores.map((v:any,i:any) => (
                                            <Col key={i} xs={24} md={8}>
                                                <CardLocador item={v} />
                                            </Col>
                                        )) }
                                        { locadoresVerMais ? (
                                            <Col span={24}>
                                                <Button loading={locadoresLoading} block type="link" onClick={loadLocadores}>Ver mais</Button>
                                            </Col>
                                        ) : null }
                                    </Row>
                                </CardItem>
                            </Col>
                            <ModalFiltros open={modal} close={onModal} />
                        </Row>
                    }
                </Col>
            </Row>
        </PageDefault>
    )
}

export default PedirCacamba;