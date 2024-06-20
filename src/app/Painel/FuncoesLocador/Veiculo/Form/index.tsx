// BIBLIOTECAS REACT
import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Button, Col, Form, Input, Modal, Row, Select, message } from "antd"

// SERVIÇOS
import {POST_API, POST_CATCH, PageDefaultProps, getToken } from "../../../../../services"

// COMPONENTES
import PageDefault from "../../../../../components/PageDefault"
import CardItem from "../../../../../components/CardItem"
import LoadItem from "../../../../../components/LoadItem"
import { TableReturnButton } from "../../../../../components/Table/buttons"
import SelectSearch from "../../../../../components/SelectSearch"

const VeiculoForm = ( { type, path, permission } : PageDefaultProps ) => {

    // RESPONSAVEL PELA ROTA
    const navigate = useNavigate()
    
    // PARAMETROS 
    const { ID } = useParams()

    // ESTADOS DO COMPONENTE
    const [ load, setLoad ] = useState(true)
    const [ loadButton, setLoadButton ] = useState(false)
    const [ vehicleType, setVehicleType ] = useState<any>(null)

    // CAMPOS FORMULARIO
    const [ form ] = Form.useForm()

    // ANOS
    const years = Array.from({ length: 20 }, (_, index) => new Date().getFullYear() + 2 - index);

    // VERIFICA "NOVO" OU "EDITAR"
    useEffect(() => {
        if (type === 'add') { setLoad(false) } else {
            setLoad(true)
            POST_API(`/${path}/search.php`, { token: getToken(), filter: JSON.stringify({ ID: ID }), type }).then(rs => rs.json()).then(res => {
                if (res.return) {
                    form.setFieldsValue(res.data[0])
                    setVehicleType({ID: res.data[0].VEHICLE_TYPE_ID})
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
            { title: <Link to={ type === 'list' ? '#' : '..' }>Veículos</Link> },
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
                                    <Col xs={10} md={6}>
                                        <Form.Item name="VEHICLE_TYPE_ID" label="Tipo de Veículo" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <SelectSearch placeholder="Tipo de Veículo" effect={vehicleType} value={form.getFieldValue('VEHICLE_TYPE_ID')} url="/vehicle_type/select.php" change={(v:any) => form.setFieldValue('VEHICLE_TYPE_ID', v?.value)}/>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <Form.Item name="PLATE" label="Placa" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Input placeholder="Placa" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <Form.Item name="RENAVAM_CODE" label="Renavam" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Input placeholder="Renavam" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <Form.Item name="BRAND" label="Marca" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Input placeholder="Marca" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <Form.Item name="MODEL" label="Modelo" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Input placeholder="Modelo" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <Form.Item name="VERSION" label="Versão">
                                            <Input placeholder="Versão" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <Form.Item name="YEAR_MANUFACTURE" label="Ano Fabricação" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Select showSearch placeholder="Ano Fabricação"> { years.map((v,i) => <Select.Option value={v} key={i}>{v}</Select.Option>) } </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <Form.Item name="YEAR_MODEL" label="Ano Modelo" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Select showSearch placeholder="Ano Modelo"> { years.map((v,i) => <Select.Option value={v} key={i}>{v}</Select.Option>) } </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} md={5}>
                                        <Form.Item name="FUEL" label="Combustível" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Input type="text" placeholder="Combustível" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <Form.Item name="MOTOR" label="Motor">
                                            <Input placeholder="Motor" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <Form.Item name="AXES" label="Eixos">
                                            <Input placeholder="Eixos" type="number" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <Form.Item name="CAPACITY" label="Lotação">
                                            <Input addonAfter="t" placeholder="Lotação" style={{width: '100%'}} type="number" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} md={3}>
                                        <Form.Item name="TOTAL_GROSS_WEIGHT" label="Tara">
                                            <Input addonAfter="t" placeholder="Tara" style={{width: '100%'}} type="number" />
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

export default VeiculoForm;