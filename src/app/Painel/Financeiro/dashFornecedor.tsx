// BIBLIOTECA REACT
import { Col, Row } from "antd"

// ICONES
import { TbCalendarDollar, TbClockDollar, TbMapPinDollar, TbUserDollar } from "react-icons/tb"

// COMPONENTES
import CardItem from "../../../components/CardItem"
import GraphPedidosRS from "../../../components/Graphics/graphPedidosRS"
import GraphMeta from "../../../components/Graphics/graphMeta"
import CardKPISmall from "../../../components/CardKPISmall"

// INTERFACE
interface DashFornecedorInterface {
    filters: any
}

const DashFornecedor = ( { filters } : DashFornecedorInterface ) => {

    return (
        <Row gutter={[16,16]}>
            <Col md={6} xs={24}>
                <CardKPISmall title="Meu Saldo (hoje)" icon={<TbUserDollar className="card-kpi-small-icon" />} value={'R$ 100,00'} />
            </Col>
            <Col md={6} xs={24}>
                <CardKPISmall title="Faturamento Total (mês)" icon={<TbClockDollar className="card-kpi-small-icon" />} value={'R$ 40,00'} />
            </Col>
            <Col md={6} xs={24}>
                <CardKPISmall title="Faturamento Total (ano)" icon={<TbMapPinDollar className="card-kpi-small-icon" />} value={'R$ 40,00'} />
            </Col>
            <Col md={6} xs={24}>
                <CardKPISmall title="Meta Anual" icon={<TbCalendarDollar className="card-kpi-small-icon" />} value={'R$ 100,00'} />
            </Col>
            <Col md={16} xs={24}>
                <CardItem title="Pedidos por mês (R$)">
                    <GraphPedidosRS filters={filters} height="20em" />
                </CardItem>
            </Col>
            <Col md={8} xs={24}>
                <CardItem title="Meta anual (%)">
                    <GraphMeta filters={filters} height="20em" />
                </CardItem>
            </Col>
        </Row>
    )

}

export default DashFornecedor