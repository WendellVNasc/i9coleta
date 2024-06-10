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

const PermissoesForm = ( { type, path, permission } : PageDefaultProps ) => {

    // RESPONSAVEL PELA ROTA
    const navigate = useNavigate()
    
    // PARAMETROS 
    const { ID } = useParams()

    // ESTADOS DO COMPONENTE
    const [ load, setLoad ] = useState(true)
    const [ loadButton, setLoadButton ] = useState(false)
    const [ permissionGroup, setPermissionGroup ] = useState<any>();

    // CAMPOS FORMULARIO
    const [form] = Form.useForm()

    // VERIFICA "NOVO" OU "EDITAR"
    useEffect(() => {
        if (type === 'add') { setLoad(false) } else {
            setLoad(true)
            POST_API(`/${path}/search.php`, { token: getToken(), filter: JSON.stringify({ ID: ID }), type }).then(rs => rs.json()).then(res => {
                if (res.return) {
                    form.setFieldsValue(res.data[0])
                    setPermissionGroup({ID: res.data[0].PERMISSION_GROUP_ID})
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
            { title: <Link to={ type === 'list' ? '#' : '..' }>Permissões</Link> },
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
                                    <Col xs={12} md={6}>
                                        <Form.Item name="PERMISSION_GROUP_ID" label="Grupo" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <SelectSearch placeholder="Grupo" effect={permissionGroup} value={form.getFieldValue('PERMISSION_GROUP_ID')} url="/permission_group/select.php" change={(v:any) => form.setFieldValue('PERMISSION_GROUP_ID', v.value)}/>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <Form.Item name="_KEY" label="Chave" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Input placeholder="Chave" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={14}>
                                        <Form.Item name="NAME" label="Nome" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Input placeholder="Nome" />
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

export default PermissoesForm;