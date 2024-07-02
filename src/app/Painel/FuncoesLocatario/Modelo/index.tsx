// BIBLIOTECAS REACT
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Avatar, Button, Col, Input, Row, Typography } from "antd";

// COMPONENTES
import PageDefault from "../../../../components/PageDefault";
import CardItem from "../../../../components/CardItem";
import LoadItem from "../../../../components/LoadItem";
import CardCacamba from "../../../../components/CardCacamba";
import ModalFiltros from "../../../../components/ModalFiltros";

// SERVIÇOS
import { GET_API } from "../../../../services";

// CSS
import './style.css'

// ICONES
import { IoFilter, IoSearch, } from "react-icons/io5";

const PedirCacambaModelo = () => {
    
    const { ID } = useParams()

    const [ modelo, setModelo ] = useState<any>(null)
    const [ modal, setModal ] = useState<boolean>(false)

    const [ cacambasLoading, setCacambasLoading ] = useState<boolean>(true);
    const [ cacambasLoadingMore, setCacambasLoadingMore ] = useState<boolean>(false);
    const [ cacambasTotal, setCacambasTotal ] = useState<number>(0);
    const [ cacambasPage, setCacambasPage ] = useState<number>(1);
    const [ cacambasSearch, setCacambasSearch ] = useState<string>('');
    const [ cacambas, setCacambas ] = useState<any[]>([])

    // CARREGA MODELO
    const onView = () => {
        GET_API(`/stationary_bucket_type/${ID}`)
        .then((rs) => rs.json())
            .then((res) => {
            setModelo(res.data)
        })
    } 

    // CARREGA CAÇAMBAS
    const loadCacambas = () => {
        setCacambasLoading(true);
        setTimeout(() => {
            GET_API(`/stationary_bucket_group?page=${cacambasPage}&per_page=10&type=${ID}`)
            .then((rs) => rs.json())
            .then((res) => {
                setCacambas(res.data)
                setCacambasPage(2)
                setCacambasTotal(Number(res.meta.total))
            }).finally(() => setCacambasLoading(false));
        }, 500);
    }

    // VER MAIS
    const moreCacambas = () => {
        setCacambasLoadingMore(true);
        setTimeout(() => {
            GET_API(`/stationary_bucket_group?page=${cacambasPage}&per_page=10&type=${ID}`)
            .then((rs) => rs.json())
            .then((res) => {
                setCacambas([...cacambas, ...res.data])
                setCacambasPage(cacambasPage+1)
                setCacambasTotal(Number(res.meta.total))
            }).finally(() => setCacambasLoading(false));
        }, 500);
    }

    const onModal = () => setModal(!modal);

    useEffect(onView, [ID])
    useEffect(loadCacambas, [ cacambasSearch, ID ])

    return (
        <PageDefault valid={true} items={[
            { title: <Link to="/painel/pedircacamba">Pedir Caçamba</Link>, },
            { title: `Modelo ${modelo?.name}` }
        ]}>
            { modelo === null ? <LoadItem /> : (
                <Row gutter={[8,8]}>
                    <Col span={24}>
                        <CardItem>
                            <Row gutter={[16,16]} style={{flexWrap: 'nowrap'}}>
                                <Col flex={'100px'}> <Avatar size={100} src={modelo?.photo} /> </Col>
                                <Col flex={'auto'}>
                                    <Typography className="pdf-name">Modelo {modelo?.name}</Typography>
                                    <Typography className="pdf-desc">Comprimento: {modelo?.letter_a_name} • Largura: {modelo?.letter_b_name} • Altura: {modelo?.letter_c_name}</Typography>
                                    <Typography className="pdf-subtitle">{cacambasTotal > 0 ? `${cacambasTotal} caçambas disponíveis` : `Nenhuma caçamba disponível`}</Typography>
                                </Col>
                            </Row>
                        </CardItem>
                    </Col>
                    <Col span={24}>
                        <CardItem>
                            <Input.Search allowClear enterButton="Procurar" onSearch={setCacambasSearch} prefix={<IoSearch color="var(--color02)" />} size="large" placeholder={`Buscar em Modelo ${modelo?.name}`} />
                        </CardItem>
                    </Col>
                    <Col span={24}>
                        <CardItem title="Caçambas disponíveis">
                            <Button onClick={onModal} icon={<IoFilter />} type="link" className="pd-button-card">Filtros</Button>
                            <Row gutter={[16,16]}>
                                { cacambasLoading ? <Col span={24}><LoadItem type="alt" /></Col> : cacambas.length > 0 ?  cacambas.map((v:any,i:any) => (
                                    <Col key={i} xs={24} md={12}>
                                        <CardCacamba type="shop" item={v} />
                                    </Col>
                                )) : <Col span={24}><Typography>Nenhuma caçamba encontrada</Typography></Col> }
                                { cacambasLoadingMore ? <Col span={24}><LoadItem type="alt" /></Col> : cacambas.length > 0 && cacambas.length < cacambasTotal ? (
                                    <Col span={24}>
                                        <Button loading={cacambasLoading} block type="link" onClick={moreCacambas}>Ver mais</Button>
                                    </Col>
                                ) : null }
                            </Row>
                        </CardItem>
                    </Col>
                    <ModalFiltros open={modal} close={onModal} />
                </Row>
            ) }
        </PageDefault>
    )

}

export default PedirCacambaModelo;