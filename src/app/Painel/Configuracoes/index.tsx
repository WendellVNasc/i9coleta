// BIBLIOTECAS REACT
import { Col, Row } from "antd";

// COMPONENETES
import PageDefault from "../../../components/PageDefault";
import Regioes from "./Regioes";
import Residuos from "./Residuos";

// CSS
import './styles.css'

// SERVIÇOS
import { verifyConfig } from "../../../services";

const Configuracoes = () => {

    return (
        <PageDefault valid={true} items={[
            { title: 'Configurações' },
        ]}>
            <Row gutter={[16,16]}>
                { verifyConfig('dsh.fnc') ? (
                    <Col span={24}>
                        <Regioes />
                    </Col>
                ) : null }
                { verifyConfig('dsh.fnc') ? (
                    <Col span={24}>
                        <Residuos />
                    </Col>
                ) : null }
            </Row>
        </PageDefault>
    )

}

export default Configuracoes;