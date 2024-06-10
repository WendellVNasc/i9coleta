// BIBLIOTECAS REACT
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Card, Checkbox, Col, Form, Input, Modal, Row, Select, Spin, message } from "antd"
import { TableReturnButton } from "../../../../../components/Table/buttons"

// SERVIÇOS
import { POST_API, POST_CATCH, PageDefaultProps, getToken } from "../../../../../services"

// COMPONENTES
import PageDefault from "../../../../../components/PageDefault"
import CardItem from "../../../../../components/CardItem"
import LoadItem from "../../../../../components/LoadItem"

const TiposDeUsuarioForm = ( { type, path, permission } : PageDefaultProps ) => {

    // RESPONSAVEL PELA ROTA
    const navigate = useNavigate()
    
    // PARAMETROS 
    const { ID } = useParams()

    // ESTADOS DO COMPONENTE
    const [ load, setLoad ] = useState(true)
    const [ loadButton, setLoadButton ] = useState(false)
    const [ loadPermission, setLoadPermission ] = useState(true);
    const [ listPermission, setListPermission ] = useState([]);
    const [ permissionSelect, setPermissionSelect ] = useState<any[]>([]);

    // CAMPOS FORMULARIO
    const [form] = Form.useForm()

    // VERIFICA "NOVO" OU "EDITAR"
    useEffect(() => {
        POST_API('/permission/page.php', { token: getToken() }).then(rs => rs.json()).then(res => {
            if (res.return) { setListPermission(res.data) } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
        }).catch(POST_CATCH).finally(() => setLoadPermission(false))
        if (type === 'add') { setLoad(false) } else {
            setLoad(true)
            POST_API(`/${path}/search.php`, { token: getToken(), filter: JSON.stringify({ ID: ID }), type }).then(rs => rs.json()).then(res => {
                if (res.return) {
                    form.setFieldsValue(res.data)
                    setPermissionSelect(res.sec)
                } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
            }).catch(POST_CATCH).finally( () => setLoad(false))
        }
    }, [type, path, form, ID]);

    // FUNÇÃO SALVAR
    const onSend = (values: any) => {
        setLoadButton(true)
        values.ID = ID
        POST_API(`/${path}/save.php`, { token: getToken(), master: JSON.stringify(values), permission: JSON.stringify(permissionSelect) }).then(rs => rs.json()).then(res => {
            if (res.return) {
                message.success(res.msg)
                navigate('..')
            } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
        }).catch(POST_CATCH).finally( () => setLoadButton(false) )
    }

    // SELECIONA PERMISSÃO
    const onChangeField = (values: any) => {

        setLoadPermission(true)

        var temp = permissionSelect
        var val = values.target.value as never
        if (temp.includes(val)) {
            temp.splice(temp.indexOf(val), 1)
        } else {
            temp.push(val)
        }

        setPermissionSelect(temp)
        setTimeout(() => {
            setLoadPermission(false)
        }, 500);
        
    } 

    // SELECIONA TODAS PERMISSÕES
    const onChangeAll = (values: any) => {

        setLoadPermission(true)

        var temp = permissionSelect
        var val:any = listPermission[values.target.value]['PERMISSION_IDS']

        val.map((v:never,i:any) => {
            if (temp.includes(v)) { } else {
                temp.push(v)
            }
            return i;
        })

        setPermissionSelect(temp)
        setTimeout(() => {
            setLoadPermission(false)
        }, 500);
        
    }
    
    return (
        <PageDefault valid={`${permission}.${type}`} items={[
            { title: <Link to={ type === 'list' ? '#' : '..' }>Tipos de Usuário</Link> },
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
                                    <Col xs={24} md={20}>
                                        <Form.Item name="NAME" label="Nome" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Input placeholder="Nome" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={4}>
                                        <Form.Item name="VISIBLE" label="Visível" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Select placeholder="Visível">
                                               <Select.Option value={'Y'}>Sim</Select.Option>
                                               <Select.Option value={'N'}>Não</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    { listPermission.map((v:any, i) => (
                                        <Col key={i} xs={24} md={Number(v.COL)}>
                                            <Card hoverable size="small" title={v.NAME}>
                                                <Row>
                                                    <Col span={24}>
                                                    { loadPermission ? <Spin size="small"><Checkbox>Selecionar Todos</Checkbox></Spin> : <Checkbox onChange={onChangeAll} value={i}>Selecionar Todos</Checkbox> }
                                                    </Col>
                                                    { v.PERMISSION.map((v1:any, i1:any) => (
                                                        <Col span={24} key={i1} style={{ display: 'flex', alignItems: 'center', height: 22}}>
                                                            { loadPermission ? <Spin size="small"><Checkbox>{v1.NAME}</Checkbox></Spin> : <Checkbox onChange={onChangeField} value={v1.ID} checked={permissionSelect.includes(v1.ID as never) ? true : false}>{v1.NAME}</Checkbox> }
                                                        </Col>
                                                    )) }
                                                </Row>
                                            </Card>
                                        </Col>
                                    )) }
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

export default TiposDeUsuarioForm;