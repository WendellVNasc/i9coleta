// BIBLIOTECAS REACT
import { useEffect, useState } from "react"
import { Col, Row } from "antd"

// COMPONENTES
import PageDefault from "../../../components/PageDefault"
import Filter from "../../../components/Filter"

// SERVIÇOS
import { verifyConfig } from "../../../services";

// PAGES
import DashDev from "./dashDev";
import DashCliente from "./dashCliente";
import LoadItem from "../../../components/LoadItem";
import DashFornecedor from "./dashFornecedor";

const Financeiro = ( ) => {

    // DADOS FILTROS
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    const anos = [2023, 2024, 2025]

    // ESTADOS DO COMPONENTE
    const [type, setType] = useState('')
    const [filterMes, setFilterMes] = useState('Maio')
    const [filterAno, setFilterAno] = useState(2024)

    // VERIFICAR TIPO DE DASH
    useEffect(() => {
        setTimeout(() => {
            if (verifyConfig('dsh.dev')) setType('DEV')
            if (verifyConfig('dsh.cln')) setType('CLN')
            if (verifyConfig('dsh.fnc')) setType('FNC')
        }, 500);
    }, [])

    return (
        <PageDefault valid={true} items={[
            { title: 'Financeiro' },
        ]} options={
            <Row gutter={[8,8]}>
                <Col><Filter name='Mês' state={filterMes} setState={setFilterMes} list={meses} /></Col>
                <Col><Filter name='Ano' state={filterAno} setState={setFilterAno} list={anos} /></Col>
            </Row>
        }>
            { type === '' ? <LoadItem /> : null }
            { type === 'DEV' ? <DashDev filters={{filterMes, filterAno}} /> : null }
            { type === 'CLN' ? <DashCliente filters={{filterMes, filterAno}} /> : null }
            { type === 'FNC' ? <DashFornecedor filters={{filterMes, filterAno}} /> : null }
        </PageDefault>
    )

}

export default Financeiro