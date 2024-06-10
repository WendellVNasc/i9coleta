// BIBLIOTECAS REACT
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Col, Form, Input, Modal, Row, message } from "antd"
import { TableReturnButton } from "../../../../../components/Table/buttons"

// SERVIÇOS
import { POST_API, POST_CATCH, PageDefaultProps, getToken } from "../../../../../services"

// COMPONENTES
import PageDefault from "../../../../../components/PageDefault"
import CardItem from "../../../../../components/CardItem"
import LoadItem from "../../../../../components/LoadItem"
import SelectSearch from "../../../../../components/SelectSearch"

const CidadesForm = ( { type, path, permission } : PageDefaultProps ) => {

    // RESPONSAVEL PELA ROTA
    const navigate = useNavigate()
    
    // PARAMETROS 
    const { ID } = useParams()

    // ESTADOS DO COMPONENTE
    const [ load, setLoad ] = useState(true)
    const [ loadButton, setLoadButton ] = useState(false)
    const [ state, setState ] = useState<any>(null)

    // CAMPOS FORMULARIO
    const [form] = Form.useForm()

    // VERIFICA "NOVO" OU "EDITAR"
    useEffect(() => {
        if (type === 'add') { setLoad(false) } else {
            setLoad(true)
            POST_API(`/${path}/search.php`, { token: getToken(), filter: JSON.stringify({ ID: ID }), type }).then(rs => rs.json()).then(res => {
                if (res.return) {
                    form.setFieldsValue(res.data[0])
                    setState({ID: res.data[0].STATE_ID})
                } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
            }).catch(POST_CATCH).finally( () => setLoad(false))
        }
    }, [type, path, form, ID]);

    // FUNÇÃO SALVAR
    const onSend = (values: any) => {
        setLoadButton(true)
        values.ID = ID
        POST_API(`/${path}/save.php`, { token: getToken(), master: JSON.stringify(values) }).then(rs => rs.json()).then(res => {
            if (res.return) {
                message.success(res.msg)
                navigate('..')
            } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
        }).catch(POST_CATCH).finally( () => setLoadButton(false) )
    }
    
    return (
        <PageDefault valid={`${permission}.${type}`} items={[
            { title: <Link to={ type === 'list' ? '#' : '..' }>Cidades</Link> },
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
                                    <Col xs={24} md={16}>
                                        <Form.Item name="NAME" label="Nome" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Input placeholder="Nome" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={4}>
                                        <Form.Item name="STATE_ID" label="Estado" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <SelectSearch placeholder="Estado" effect={state} value={form.getFieldValue('STATE_ID')} url="/state/select.php" change={(v:any) => form.setFieldValue('STATE_ID', v.value)}/>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <Form.Item name="IBGE_ID" label="Codígo IBGE">
                                            <Input placeholder="Codígo IBGE" />
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

export default CidadesForm;