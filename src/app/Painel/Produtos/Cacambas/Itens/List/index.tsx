// BIBLIOTECAS REACT
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Col, Form, Input, Modal, Row, message } from "antd";

// SERVIÇOS
import { POST_API, POST_CATCH, PageDefaultProps, getToken } from "../../../../../../services";

// COMPONENTES
import PageDefault from "../../../../../../components/PageDefault";
import CardItem from "../../../../../../components/CardItem";
import Table from "../../../../../../components/Table";
import { TableNewButton, TableReturnButton, TableTrEditButton, TableTrQrCodeButton, TableTrRecoverButton, TableTrTrashButton, TableTrashButton } from "../../../../../../components/Table/buttons";
import { TbArrowsRandom } from "react-icons/tb";

const CacambasItensList = ({ type, path, permission } : PageDefaultProps ) => {

    // PARAMETROS 
    const { ID } = useParams()

    // ESTADOS DO COMPONENTE
    const [ action, setAction ] = useState(false);
    const [ open, setOpen ] = useState(false);
    const [ load, setLoad ] = useState(false);

    // DEFINE COLUNAS DA TABELA
    const column = [
        { title: 'Código', dataIndex: 'code', table: 'code', width: 'auto', sorter: true, align: 'left', render: null },
        { title: 'Situação', dataIndex: 'status_name', table: 'status', width: '200px', sorter: true, align: 'center', render: null },
        { title: 'Ações', dataIndex: null, width: '120px', sorter: false, align: 'center', render: (item: any) => (
            <Row justify={'center'} style={{width: '100%'}}>
                <TableTrQrCodeButton type={type} permission={permission} item={item} />
                <TableTrEditButton type={type} permission={permission} item={item} />
                <TableTrTrashButton type={type} permission={permission} item={item} action={() => setAction(!action)} path={path} />
                <TableTrRecoverButton type={type} permission={permission} item={item} action={() => setAction(!action)} path={path} />
            </Row>
        ) },
    ]

    const [ form ] = Form.useForm()

    const onSend = (values: any) => {
        setLoad(true)
        values.STATIONARY_BUCKET_GROUP_ID = ID
        POST_API(`/${path}/gerar.php`, { token: getToken(), master: JSON.stringify(values) }).then(rs => rs.json()).then(res => {
            if (res.return) {
                message.success(res.msg)
                setAction(!action)
                setOpen(false)
            } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
        }).catch(POST_CATCH).finally( () => setLoad(false) )
    }

    return (
        <PageDefault valid={`${permission}.${type}`} items={[
            { title: <Link to='/painel/cacambas'>Caçambas</Link> },
            { title: <Link to={ type === 'list' ? '#' : '..' }>Itens</Link> },
            { title: type === 'list' ? 'Lista' : 'Lixeira' },
        ]} options={
            <Row justify={'end'} gutter={[8,8]}>
                <Col><Button onClick={() => setOpen(true)} size="small" shape="circle" type='text' className="page-default-button"><TbArrowsRandom /></Button></Col>
                <TableNewButton type={type} permission={permission} />
                <TableTrashButton type={type} permission={permission} />
                <TableReturnButton type={type} permission={permission} />
            </Row>
        }>
            <Row gutter={[16,16]}>
                <Col md={24} xs={24}>
                    <CardItem>
                        <Table
                            column={column}
                            path={path}
                            type={type}
                            action={action}
                            defaultFilter={{ group_id: ID }}
                        />
                    </CardItem>
                </Col>
            </Row>
            <Modal title="Gerar códigos aleatórios" open={open} onCancel={() => setOpen(false)} destroyOnClose okText="Gerar" cancelText="Cancelar" onOk={form.submit} confirmLoading={load}>
                <Form layout="vertical" form={form} onFinish={onSend}>
                    <Form.Item name={"QTDE_CODE"} label="Quantidade de códigos gerados" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                        <Input type="number" placeholder="Quantidade de códigos gerados" />
                    </Form.Item>
                    <Form.Item name={"QTDE_CARC"} label="Quantidade de caracteres por código" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                        <Input type="number" placeholder="Quantidade de caracteres por código" />
                    </Form.Item>
                </Form>
            </Modal>
        </PageDefault>
    )

}

export default CacambasItensList;