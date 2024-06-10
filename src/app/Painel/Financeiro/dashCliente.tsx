// BIBLIOTECA REACT
import { Col, Row } from "antd"

// ICONES
import { IoCartOutline, IoCashOutline } from "react-icons/io5"

// COMPONENTES
import CardKPI from "../../../components/CardKPI"
import CardItem from "../../../components/CardItem"
import GraphTotalUsuarios from "../../../components/Graphics/graphTotalUsuarios"
import GraphServicosMaisUsados from "../../../components/Graphics/graphServicosMaisUsados"

// INTERFACE
interface DashClienteInterface {
    filters: any
}

const DashCliente = ( { filters } : DashClienteInterface ) => {

    return (
        <Row gutter={[16,16]}>
            <Col md={6} xs={24}>
                <CardKPI title="Caçambas Pedidas" icon={<IoCartOutline className="card-kpi-icon" />} value={10} />
            </Col>
            <Col md={6} xs={24}>
                <CardKPI title="Caçambas Locadas" icon={<IoCartOutline className="card-kpi-icon" />} value={10} />
            </Col>
            <Col md={12} xs={24}>
                <CardKPI title="Total Resíduos" icon={<IoCartOutline className="card-kpi-icon" />} value={'1000 KG'} />
            </Col>
            <Col md={14} xs={24}>
                <CardItem title="Caçambas por mês">
                    <GraphTotalUsuarios filters={filters} height="20em" />
                </CardItem>
            </Col>
            <Col md={10} xs={24}>
                <CardItem title="Últimos Pedidos">
                    <GraphServicosMaisUsados filters={filters} height="20em" />
                </CardItem>
            </Col>
        </Row>
    )

}

export default DashCliente