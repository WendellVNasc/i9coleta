// BIBLIOTECAS REACT
import { Button, Card, Col, Drawer, Form, Input, Modal, Row, Typography } from "antd";
import { useEffect, useState } from "react";

// ICONES
import { IoSearch } from "react-icons/io5";
import { TiPin } from "react-icons/ti";

// CSS
import './style.css';

// SERVIÇOS
import { MaskCEP, POST_API, POST_CATCH, getToken } from "../../services";

// COMPONENTES
import SelectSearch from "../SelectSearch";
import LoadItem from "../LoadItem";

// INTERFACE
interface DrawerEnderecoInterface {
    open: boolean,
    close: any,
    address: any,
    setAddress: any,
}

const DrawerEndereco = ( { open, close, address, setAddress } : DrawerEnderecoInterface ) => {

    // ESTADOS DO COMPONENTE
    const [ newAddress, setNewAddress ] = useState<boolean>(false)
    const [ addressList, setAddressList ] = useState<any[]>([])
    const [ loadCEP, setLoadCEP ] = useState<any>(false)
    const [ loadButton, setLoadButton ] = useState<any>(true)
    const [ city, setCity ] = useState<any>(null);
    const [ state, setState ] = useState<any>(null);
    const [ mee, setMee ] = useState<any>(null);
    const [ search, setSearch ] = useState<any>('')

    const onNewAddress = () => setNewAddress(!newAddress)

    // FUNÇÃO BUSCAR CEP
    const onCEP = () => {
        setLoadCEP(true)
        POST_API('/cep/search.php', { token: getToken(), master: JSON.stringify({CEP: form.getFieldValue('CEP')}) }).then(rs => rs.json()).then(res => {
            if (res.return) {
                form.setFieldValue('STREET', res.data.nome_logradouro)
                form.setFieldValue('DISTRICT', res.data.bairro)
                setState({ACRONYM: res.data.uf})
                setCity({search: res.data.nome_localidade+' - '+res.data.uf})
            } else {
                Modal.warning({ title: 'Algo deu errado', content: res.msg })
            }
        }).catch(POST_CATCH).finally( () => setLoadCEP(false) )
    }
    
    // FUNÇÃO SALVAR
    const onSend = (values: any) => {
        setLoadButton(true)
        POST_API(`/address/save.php`, { token: getToken(), master: JSON.stringify(values) }).then(rs => rs.json()).then(res => {
            if (res.return) {
                setNewAddress(false)
                onSearch()
            } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
        }).catch(POST_CATCH).finally( () => setLoadButton(false) )
    }
    
    // FUNÇÃO PESQUISAR
    const onSearch = () => {
        setLoadButton(true)
        POST_API(`/address/search.php`, { token: getToken(), search: search }).then(rs => rs.json()).then(res => {
            if (res.return) { setAddressList(res.data); setMee(res.self) } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
        }).catch(POST_CATCH).finally( () => setLoadButton(false) )
    }

    const [ form ] = Form.useForm()

    useEffect(() => {
        if (open) onSearch()
    }, [search, open])

    useEffect(() => {
        close()
    }, [address])

    return (
        <Drawer open={open} onClose={close} title="Selecionar endereço">
            { newAddress ? (
                <Form layout='vertical' form={form} onFinish={onSend}>
                    <Row gutter={[8,0]}>
                        <Col span={24}>
                            <Form.Item name="NAME" label="Salvar endereço como" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                <Input placeholder="Nome"  />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="CEP" label="CEP" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                <Input placeholder="CEP" onKeyDown={MaskCEP} maxLength={9} onBlur={onCEP}  />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="STREET" label="Logradouro" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                <Input placeholder="Logradouro" disabled={loadCEP} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="NUMB" label="Número">
                                <Input placeholder="Número" disabled={loadCEP} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="DISTRICT" label="Bairro" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                <Input placeholder="Bairro" disabled={loadCEP} />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="CITY_ID" label="Cidade" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                <SelectSearch effect={city} placeholder="Cidade" disabled={loadCEP} url="/city/select.php" value={form.getFieldValue('CITY_ID')} change={(v:any) => form.setFieldValue('CITY_ID', v.value)}/>
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item name="STATE_ID" label="Estado" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                <SelectSearch effect={state} placeholder="Estado" disabled={loadCEP} url="/state/select.php" value={form.getFieldValue('STATE_ID')} change={(v:any) => form.setFieldValue('STATE_ID', v.value)}/>
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Button onClick={onNewAddress} block type='default'>Cancelar</Button>
                        </Col>
                        <Col span={12}>
                            <Button block type='primary' loading={loadButton} htmlType='submit'>Salvar</Button>
                        </Col>
                    </Row>
                </Form>
            ) : (
                <Row gutter={[8,16]}>
                    <Col span={24}>
                        <Input prefix={<IoSearch color="var(--color02)" />} size="large" placeholder="Buscar em endereço" value={search} onChange={(v) => setSearch(v.target.value)} />
                    </Col>
                    <Col span={24}>
                        <Card size='small' hoverable onClick={() => setAddress({...mee, ID: '*'})}>
                            <Typography className='ad-title'><TiPin/> Meu endereço principal</Typography>
                            <Typography>{mee?.STREET}, {mee?.NUMB} - {mee?.DISTRICT} - {mee?.CITY_NAME} / {mee?.STATE_ACRONYM}</Typography>
                        </Card>
                    </Col>
                    { loadButton ? <Col span={24}><LoadItem type='alt' /></Col> : addressList.length > 0 ? addressList.map((v, i) => (
                        <Col span={24} key={i}>
                            <Card size='small' hoverable onClick={() => setAddress(v)}>
                                <Typography className='ad-title'>{v.NAME}</Typography>
                                <Typography>{v.STREET}, {v.NUMB} - {v.DISTRICT} - {v.CITY_NAME} / {v.STATE_ACRONYM}</Typography>
                            </Card>
                        </Col>
                    )) : <Col span={24}><Typography>Não há mais endereços</Typography></Col> }
                    <Col span={24}>
                        <Button onClick={onNewAddress} block type='primary'>Novo endereço</Button>
                    </Col>
                </Row>
            ) }
        </Drawer>
    )

}

export default DrawerEndereco;