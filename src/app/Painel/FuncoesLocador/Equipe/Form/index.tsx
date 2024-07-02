// BIBLIOTECAS REACT
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Checkbox, Col, Form, Input, Modal, Row, Switch, message } from "antd"

// SERVIÇOS
import { GET_API, MaskCNPJ, MaskCPF, POST_API, POST_CATCH, PageDefaultProps, getToken } from "../../../../../services"

// COMPONENTES
import PageDefault from "../../../../../components/PageDefault"
import CardItem from "../../../../../components/CardItem"
import LoadItem from "../../../../../components/LoadItem"
import { TableReturnButton } from "../../../../../components/Table/buttons"

const EquipeForm = ( { type, path, permission } : PageDefaultProps ) => {

    // RESPONSAVEL PELA ROTA
    const navigate = useNavigate()
    
    // PARAMETROS 
    const { ID } = useParams()

    // ESTADOS DO COMPONENTE
    const [ load, setLoad ] = useState(true)
    const [ doc, setDoc ] = useState(false)
    const [ loadButton, setLoadButton ] = useState(false)

    // CAMPOS FORMULARIO
    const [form] = Form.useForm()

    // VERIFICA "NOVO" OU "EDITAR"
    useEffect(() => {
        if (type === 'add') { setLoad(false) } else {
            setLoad(true)
            GET_API(`/user/${ID}`)
            .then((rs) => {
                if (rs.ok) {
                    return rs.json();
                } else {
                    Modal.warning({ title: "Algo deu errado", content: rs.statusText });
                }
            })
            .then((res) => {
                form.setFieldsValue(res.data);
            })
            .catch(POST_CATCH)
            .finally(() => setLoad(false));
        }
    }, [type, path, form, ID]);

    // FUNÇÃO SALVAR
    const onSend = (values: any) => {
        setLoadButton(true)
        values.profile_type = 'seller_employee'
        POST_API(`/user`, values, ID)
        .then((rs) => {
            if (rs.ok) {
                message.success("Salvo com sucesso!");
                navigate("..");
            } else {
              Modal.warning({ title: "Algo deu errado", content: rs.statusText });
            }
          })
          .catch(POST_CATCH)
          .finally(() => setLoadButton(false)); 
    }

    useEffect(() => {
        form.resetFields()
    }, [doc])
    
    return (
        <PageDefault valid={`${permission}.${type}`} items={[
            { title: <Link to={ type === 'list' ? '#' : '..' }>Equipe</Link> },
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
                                    <Col xs={24} md={18}>
                                        <Form.Item name="name" label="Nome" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Input placeholder="Nome" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Item name="document_number" label="Login" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Input placeholder="Login" autoComplete="off" maxLength={ doc ? 18 : 14 } onKeyPress={ doc ? MaskCNPJ : MaskCPF } addonAfter={<Switch size="small" checkedChildren="CNPJ" unCheckedChildren="CPF" onChange={setDoc} checked={doc} />} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={7}>
                                        <Form.Item name="email" label="E-mail Principal" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Input placeholder="E-mail Principal" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={7}>
                                        <Form.Item name="secondary_email" label="E-mail Secundário">
                                            <Input placeholder="E-mail Secundário" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={5}>
                                        <Form.Item name="phone" label="Telefone Principal" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Input placeholder="Telefone Principal" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={5}>
                                        <Form.Item name="secondary_phone" label="Telefone Secundário">
                                            <Input placeholder="Telefone Secundário" />
                                        </Form.Item>
                                    </Col>
                                    {/* <Col xs={24} md={24}>
                                        <Form.Item name="PERMISSIONS" label="Permissões" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Checkbox.Group options={[
                                                { label: 'Dashboard Operacional', value: '15.81' },
                                                { label: 'Dashboard Financeiro', value: '15.89' },
                                                { label: 'Pedidos', value: '14.*' },
                                                { label: 'Avaliações', value: '17.*' },
                                                { label: 'Caçambas', value: '10.*' },
                                            ]} />
                                        </Form.Item>
                                    </Col> */}
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

export default EquipeForm;