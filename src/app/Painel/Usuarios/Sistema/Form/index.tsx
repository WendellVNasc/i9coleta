// BIBLIOTECAS REACT
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Col, Form, Input, Modal, Row, Switch, message } from "antd"
import { TableReturnButton } from "../../../../../components/Table/buttons"

// SERVIÇOS
import { MaskCNPJ, MaskCPF, POST_API, POST_CATCH, PageDefaultProps, getToken } from "../../../../../services"

// COMPONENTES
import PageDefault from "../../../../../components/PageDefault"
import CardItem from "../../../../../components/CardItem"
import LoadItem from "../../../../../components/LoadItem"
import SelectSearch from "../../../../../components/SelectSearch"

const SistemaForm = ( { type, path, permission } : PageDefaultProps ) => {

    // RESPONSAVEL PELA ROTA
    const navigate = useNavigate()
    
    // PARAMETROS 
    const { ID } = useParams()

    // ESTADOS DO COMPONENTE
    const [ load, setLoad ] = useState(true)
    const [ doc, setDoc ] = useState(false)
    const [ loadButton, setLoadButton ] = useState(false)
    const [ credentialType, setCredentialType ] = useState<any>(null)

    // CAMPOS FORMULARIO
    const [form] = Form.useForm()

    // VERIFICA "NOVO" OU "EDITAR"
    useEffect(() => {
        if (type === 'add') { setLoad(false) } else {
            setLoad(true)
            POST_API(`/${path}/search.php`, { token: getToken(), filter: JSON.stringify({ ID: ID }), type }).then(rs => rs.json()).then(res => {
                if (res.return) {
                    form.setFieldsValue(res.data[0])
                    setCredentialType({ID: res.data[0].CREDENTIAL_TYPE_ID})
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

    useEffect(() => {
        form.resetFields()
    }, [doc])
    
    return (
        <PageDefault valid={`${permission}.${type}`} items={[
            { title: <Link to={ type === 'list' ? '#' : '..' }>Usuário Sistema</Link> },
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
                                    <Col xs={24} md={6}>
                                        <Form.Item name="LOGIN" label="Login" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Input disabled={type === 'edit'} placeholder="Login" autoComplete="off" maxLength={ doc ? 18 : 14 } onKeyDown={ doc ? MaskCNPJ : MaskCPF } addonAfter={<Switch size="small" checkedChildren="CNPJ" unCheckedChildren="CPF" onChange={setDoc} checked={doc} disabled={type === 'edit'} />} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={12}>
                                        <Form.Item name="NAME" label="Nome" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Input placeholder="Nome" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Item name="CREDENTIAL_TYPE_ID" label="Tipo de Usuário" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <SelectSearch placeholder="Tipo de Usuário" effect={credentialType} value={form.getFieldValue('CREDENTIAL_TYPE_ID')} url="/credential_type/select.php" change={(v:any) => form.setFieldValue('CREDENTIAL_TYPE_ID', v.value)}/>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={7}>
                                        <Form.Item name="EMAIL_01" label="E-mail Principal" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Input placeholder="E-mail Principal" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={7}>
                                        <Form.Item name="EMAIL_02" label="E-mail Secundário">
                                            <Input placeholder="E-mail Secundário" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={5}>
                                        <Form.Item name="PHONE_01" label="Telefone Principal" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Input placeholder="Telefone Principal" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={5}>
                                        <Form.Item name="PHONE_02" label="Telefone Secundário">
                                            <Input placeholder="Telefone Secundário" />
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

export default SistemaForm;