// BIBLIOTECAS REACT
import { useEffect, useState } from "react";
import { Button, Col, List, Modal, Row, Typography } from "antd";

// SERVIÇOS
import { POST_API, POST_CATCH, getToken } from "../../../services";

// ICONES
import { TbCheck, TbTrash } from "react-icons/tb";
import { ExclamationCircleOutlined } from '@ant-design/icons';

// COMPONENTES
import CardItem from "../../../components/CardItem";
import Table from "../../../components/Table";

const Residuos = () => {

    // ESTADOS DO COMPONENTE
    const [ reside, setReside ]   = useState<any[]>([]);
    const [ loadSend, setLoadSend ] = useState<boolean>(false);
    const [ modal, setModal ]       = useState<boolean>(false);

    // DEFINE COLUNAS DA TABELA
    const column = [
        { title: 'Grupo de Resíduo', dataIndex: 'name', table: 'residues.name', width: 'auto', sorter: true, align: 'center', render: (item:any) => <Row style={{width: '100%'}}><Col span={24}>{item.name+' - '+item.description}</Col></Row> },
        { title: 'Ações', dataIndex: null, width: '60px', sorter: false, align: 'center', render: (item: any) => (
            <Row justify={'center'} style={{width: '100%'}}>
                <Col><TbCheck size={18} className="actions-button" onClick={() => onSend(item)}/></Col>
            </Row>
        ) },
    ]

    // CARREGA DADOS
    const load = () => {
        POST_API('/credential_reside/search.php', { token: getToken() }).then(rs => rs.json()).then(res => {
            if (res.return) {
                setReside(res.data)
            }
        }).catch(POST_CATCH)
    }

    const onModal = () => setModal(!modal)

    const onSend = ( item:any ) => {
        Modal.confirm({
            title: 'Adicionar resíduo "'+item.name+' - '+item.description+'"?', icon: <ExclamationCircleOutlined />, cancelText: 'Não', okText: 'Sim',
            onOk() {
                POST_API('/user_residue', { token: getToken(), master: JSON.stringify({ residue_id: item.id }) }).then(rs => rs.json()).then(res => {
                    if (res.return) {
                        load()
                        onModal()
                    } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
                }).catch(POST_CATCH)
            },
            onCancel() {},
        })
    }

    const onAction = (item:any) => {
        Modal.confirm({
            title: 'Deletar resíduo "'+item.RESIDE_CODE+' - '+item.RESIDE_NAME+'"?', icon: <ExclamationCircleOutlined />, cancelText: 'Não', okText: 'Sim',
            onOk() {
                POST_API(`/credential_reside/del.php`, { token: getToken(), ID: item.ID, type: 'del' }).then(rs => rs.json()).then(res => {
                    if (res.return) {
                        load()
                    } else {  Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
                }).catch(POST_CATCH)
            },
            onCancel() {},
        })
    }

    useEffect(() => {
        load()
    }, [])

    return (
        <CardItem title="Resíduos">
            { reside.length > 0 ? (
                <List size="small"
                    itemLayout="horizontal"
                    dataSource={reside}
                    renderItem={item => (
                        <List.Item actions={[<TbTrash onClick={() => onAction(item)} size={18} className="actions-button"/>]}>
                            <List.Item.Meta
                                title={item.RESIDE_NAME}
                                description={item.RESIDE_DESC}
                            />
                        </List.Item>
                    )}
                />
            ) : <Typography>Nenhum resíduo cadastrado</Typography> }
            <Button onClick={onModal} type="primary" style={{marginTop: '1em'}}>Adicionar Resíduo</Button>
            <Modal title="Adicionar Resíduo" open={modal} onCancel={onModal} cancelText="Fechar" okText="Salvar" maskClosable={false} onOk={onSend} confirmLoading={loadSend}>
                <Table
                    column={column}
                    path={'residue'}
                    type={'list'}
                    action={null}
                />
            </Modal>
        </CardItem>
    )

}

export default Residuos