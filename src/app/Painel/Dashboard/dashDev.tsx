// BIBLIOTECA REACT
import { Col, Row } from "antd"

// ICONES
import { IoAlertOutline, IoMailOpenOutline, IoNotificationsOutline, IoPeopleOutline } from "react-icons/io5"

// COMPONENTES
import CardKPI from "../../../components/CardKPI"
import CardItem from "../../../components/CardItem"
import GraphAcessos from "../../../components/Graphics/graphAcessos"
import GraphPerformance from "../../../components/Graphics/graphPerformance"
import GraphTotalUsuarios from "../../../components/Graphics/graphTotalUsuarios"
import GraphServicosMaisUsados from "../../../components/Graphics/graphServicosMaisUsados"
import GraphMaiorTempoResposta from "../../../components/Graphics/graphMaiorTempoResposta"

// INTERFACE
interface DashDevInterface {
    filters: any
}

const DashDev = ( { filters } : DashDevInterface ) => {

    return (
        <Row gutter={[16,16]}>
            <Col md={6} xs={24}>
                <CardKPI title="Usuários Logados" icon={<IoPeopleOutline className="card-kpi-icon" />} value={10} />
            </Col>
            <Col md={6} xs={24}>
                <CardKPI title="Notificações" icon={<IoNotificationsOutline className="card-kpi-icon" />} value={10} />
            </Col>
            <Col md={6} xs={24}>
                <CardKPI title="Mensagens" icon={<IoMailOpenOutline className="card-kpi-icon" />} value={10} />
            </Col>
            <Col md={6} xs={24}>
                <CardKPI title="Logs de Erro" icon={<IoAlertOutline className="card-kpi-icon" />} value={10} />
            </Col>
            <Col md={16} xs={24}>
                <CardItem title="Acessos">
                    <GraphAcessos filters={filters} height="20em" />
                </CardItem>
            </Col>
            <Col md={8} xs={24}>
                <CardItem title="Performance">
                    <GraphPerformance filters={filters} height="20em" />
                </CardItem>
            </Col>
            <Col md={7} xs={24}>
                <CardItem title="Serviços mais usados">
                    <GraphServicosMaisUsados filters={filters} height="20em" />
                </CardItem>
            </Col>
            <Col md={7} xs={24}>
                <CardItem title="Maior tempo de resposta">
                    <GraphMaiorTempoResposta filters={filters} height="20em" />
                </CardItem>
            </Col>
            <Col md={10} xs={24}>
                <CardItem title="Total de usuários">
                    <GraphTotalUsuarios filters={filters} height="20em" />
                </CardItem>
            </Col>
        </Row>
    )

}

export default DashDev