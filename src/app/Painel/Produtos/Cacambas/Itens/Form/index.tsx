// BIBLIOTECAS REACT
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Col, Form, Input, Modal, Radio, Row, message } from "antd"
import { TableReturnButton } from "../../../../../../components/Table/buttons"

// SERVIÇOS
import { POST_API, POST_CATCH, PageDefaultProps, getToken, verifyConfig } from "../../../../../../services"

// COMPONENTES
import PageDefault from "../../../../../../components/PageDefault"
import CardItem from "../../../../../../components/CardItem"
import LoadItem from "../../../../../../components/LoadItem"
import SelectSearch from "../../../../../../components/SelectSearch"

const CacambasItensForm = ( { type, path, permission } : PageDefaultProps ) => {

    // RESPONSAVEL PELA ROTA
    const navigate = useNavigate()
    
    // PARAMETROS 
    const { ID, ID2 } = useParams()

    // ESTADOS DO COMPONENTE
    const [ load, setLoad ] = useState(true)
    const [ loadButton, setLoadButton ] = useState(false)
    const [ model, setModel ] = useState<any>(null);
    const [ provider, setProvider ] = useState<any>(null);

    // CAMPOS FORMULARIO
    const [form] = Form.useForm()

    // VERIFICA "NOVO" OU "EDITAR"
    useEffect(() => {
        if (type === 'add') { setLoad(false) } else {
            setLoad(true)
            POST_API(`/${path}/search.php`, { token: getToken(), filter: JSON.stringify({ ID: ID2 }), type }).then(rs => rs.json()).then(res => {
                if (res.return) {
                    form.setFieldsValue(res.data[0])
                    setModel({ID: res.data[0].STATIONATY_BUCKET_TYPE_ID})
                    setProvider({ID: res.data[0].CREDENTIAL_ID})
                } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
            }).catch(POST_CATCH).finally( () => setLoad(false))
        }
    }, [type, path, form, ID]);

    // FUNÇÃO SALVAR
    const onSend = (values: any) => {
        setLoadButton(true)
        values.ID = ID2
        values.STATIONARY_BUCKET_GROUP_ID = ID
        POST_API(`/${path}/save.php`, { token: getToken(), master: JSON.stringify(values) }).then(rs => rs.json()).then(res => {
            if (res.return) {
                message.success(res.msg)
                navigate('..')
            } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
        }).catch(POST_CATCH).finally( () => setLoadButton(false) )
    }

    return (
        <PageDefault valid={`${permission}.${type}`} items={[
            { title: <Link to='/painel/cacambas'>Caçambas</Link> },
            { title: <Link to={ type === 'list' ? '#' : '..' }>Itens</Link> },
            { title: type === 'add' ? 'Novo' : 'Editar' },
        ]} options={
            <Row justify={'end'} gutter={[8,8]}>
                <TableReturnButton type={type} permission={permission} />
            </Row>
        }>
            <Row gutter={[16,16]}>
                <Col md={24} xs={24}>
                    { load ? <LoadItem /> :
                        <CardItem>
                            <Form layout="vertical" form={form} onFinish={onSend}>
                                <Row gutter={[8,8]}>
                                    <Col xs={24} md={24}>
                                        <Form.Item name="CODE" label="Código Identificação" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Input placeholder="Código Identificação"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={24}>
                                        <Button shape="round" htmlType="submit" type="primary" style={{float: 'right', marginLeft: 6}} loading={loadButton}>Salvar</Button>
                                        <Link to={'..'}><Button shape="round" type="default" style={{float: 'right'}}>Cancelar</Button></Link>
                                    </Col>
                                </Row>
                            </Form>
                        </CardItem>
                    }
                </Col>
            </Row>
        </PageDefault>
    )

}

export default CacambasItensForm;