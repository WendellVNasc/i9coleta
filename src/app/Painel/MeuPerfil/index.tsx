// BIBLIOTECAS REACT
import { useEffect, useState } from "react";
import { Avatar, Col, Row, Tag, Typography, Form, Input, Switch, Button, Upload, Modal } from "antd";
import ImgCrop from "antd-img-crop";

// SERVIÇOS
import { MaskCEP, MaskCPF, POST_API, POST_CATCH, getToken, getUPLOADAPI, verifyConfig } from "../../../services";

// COMPONENETES
import PageDefault from "../../../components/PageDefault";
import CardItem from "../../../components/CardItem";
import LoadItem from "../../../components/LoadItem";

// ICONES
import { IoCameraOutline } from "react-icons/io5";

// CSS
import './styles.css'
import SelectSearch from "../../../components/SelectSearch";

const MeuPerfil = () => {

    // ESTADOS DO COMPONENTE
    const [ user, setUser ] = useState<any>(null);
    const [ doc, setDoc ] = useState<boolean>(false);
    const [ loadButton, setLoadButton ] = useState<boolean>(false);
    const [ loadPassButton, setLoadPassButton ] = useState<boolean>(false);
    const [ loadCEP, setLoadCEP ] = useState(false);
    const [ city, setCity ] = useState<any>(null);
    const [ state, setState ] = useState<any>(null);

    // CAMPOS FORM
    const [ form ] = Form.useForm()
    const [ formPass ] = Form.useForm()

    // EDITAR FOTO
    const onChangePic = (value:any) => {
        if (value.file.response?.url) {
            POST_API('/credential/self-save.php', { token: getToken(), master: JSON.stringify({PHOTO: value.file.response?.url}) }).then(rs => rs.json()).then(res => {
                if (res.return) {
                    load()
                } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
            }).catch(POST_CATCH)
        }
    }

    // EDITAR DADOS
    const onSend = (values:any) => {
        setLoadButton(true)
        POST_API('/credential/self-save.php', { token: getToken(), master: JSON.stringify(values) }).then(rs => rs.json()).then(res => {
            if (res.return) {
                load()
            } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
        }).catch(POST_CATCH).finally(() => setLoadButton(false))
    }

    // EDITAR SENHA
    const onSendPass = (values:any) => {
        setLoadPassButton(true)
        POST_API('/credential/self-pass.php', { token: getToken(), master: JSON.stringify(values) }).then(rs => rs.json()).then(res => {
            if (res.return) {
                Modal.success({ title: 'Sucesso', content: res.msg})
                formPass.resetFields()
            } else { Modal.warning({ title: 'Algo deu errado', content: res.msg }) }
        }).catch(POST_CATCH).finally(() => setLoadPassButton(false))
    }

    // CARREGA DADOS
    const load = () => {
        setUser(null)
        POST_API('/credential/search.php', { token: getToken(), type: 'self' }).then(rs => rs.json()).then(res => {
            if (res.return) {
                form.setFieldsValue(res.data)
                setState({ID: res.data.STATE_ID})
                setCity({ID: res.data.CITY_ID})
                setUser(res.data)
                setDoc(String(res.data.LOGIN).length > 15)
            }
        }).catch(POST_CATCH)
    }

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

    useEffect(() => {
        load()
    }, [])

    return (
        <PageDefault valid={true} items={[
            { title: 'Meu Perfil' },
        ]}>
            { user ?
                <Row gutter={[16,16]} className="mp-row">
                    <Col flex={'24em'} className="mp-col">
                        <CardItem>
                            <Row justify={'center'} align={'middle'} style={{flexDirection:'column'}}>
                                <Col><Avatar className="mp-avatar" src={user.PHOTO} /></Col>
                                <ImgCrop>
                                    <Upload className="btn-upload-div" maxCount={1} showUploadList={false} accept="image/jpg,image/jpeg,image/png" action={getUPLOADAPI} onChange={onChangePic}>
                                        <Button shape="circle" type="primary" className="btn-upload"><IoCameraOutline /></Button>
                                    </Upload>
                                </ImgCrop>
                                <Col><Typography className="mp-name">{user.NAME}</Typography></Col>
                                <Col><Tag className="mp-type">{user.CREDENTIAL_TYPE_NAME}</Tag></Col>
                            </Row>
                        </CardItem>
                        <div style={{marginTop: '1.2em'}}></div>
                        <CardItem title="Mudar senha">
                            <Form form={formPass} layout="vertical" onFinish={onSendPass}>
                                <Form.Item name="OLD_PASSWORD" label="Senha Atual" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                    <Input.Password placeholder="Senha Atual" />
                                </Form.Item>
                                <Form.Item name="NEW_PASSWORD" label="Senha Nova" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                    <Input.Password placeholder="Senha Nova" />
                                </Form.Item>
                                <Button shape="round" htmlType="submit" type="primary" style={{float: 'right', marginLeft: 6}} loading={loadPassButton}>Alterar</Button>
                            </Form>
                        </CardItem>
                    </Col>
                    <Col flex={'auto'}>
                        <CardItem>
                            <Form layout="vertical" form={form} onFinish={onSend}>
                                <Row gutter={[8,8]}>
                                    <Col xs={24} md={8}>
                                        <Form.Item name="LOGIN" label={ doc ? "CNPJ" : "CPF" } rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Input placeholder={ doc ? "CNPJ" : "CPF" } disabled addonAfter={<Switch size="small" checkedChildren="CNPJ" unCheckedChildren="CPF" checked={doc} disabled />} />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={ doc ? 8 : 16 }>
                                        <Form.Item name="NAME" label={ doc ? "Razão Social" : "Nome" } rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                            <Input placeholder={ doc ? "Razão Social" : "Nome" } />
                                        </Form.Item>
                                    </Col>
                                    { doc ? 
                                        <Col xs={24} md={8}>
                                            <Form.Item name="FANTASY" label="Nome Fantasia">
                                                <Input placeholder="Nome Fantasia" />
                                            </Form.Item>
                                        </Col>
                                    : null }
                                    <Col xs={12} md={7}>
                                        <Form.Item name="EMAIL_01" label="E-mail Principal">
                                            <Input placeholder="E-mail Principal" type="email"/>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} md={7}>
                                        <Form.Item name="EMAIL_02" label="E-mail Secundário">
                                            <Input placeholder="E-mail Secundário" type="email"/>
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} md={5}>
                                        <Form.Item name="PHONE_01" label="Telefone Principal">
                                            <Input placeholder="Telefone Principal" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={12} md={5}>
                                        <Form.Item name="PHONE_02" label="Telefone Secundário">
                                            <Input placeholder="Telefone Secundário" />
                                        </Form.Item>
                                    </Col>
                                    <Col xs={24} md={24}>
                                        <Form.Item name="DESCRIPTION" label="Breve descrição e preferêcias">
                                            <Input.TextArea rows={4} placeholder="Breve descrição e preferêcias" />
                                        </Form.Item>
                                    </Col>
                                    { verifyConfig('ffn.atp') || verifyConfig('fcl.atp') ? (
                                        <>
                                        <Col xs={24} md={3}>
                                            <Form.Item name="CEP" label="CEP" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                                <Input placeholder="CEP" onKeyPress={MaskCEP} maxLength={9} onBlur={onCEP}  />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={21}>
                                            <Form.Item name="STREET" label="Logradouro" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                                <Input placeholder="Logradouro" disabled={loadCEP} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={4}>
                                            <Form.Item name="NUMB" label="Número">
                                                <Input placeholder="Número" disabled={loadCEP} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={10}>
                                            <Form.Item name="DISTRICT" label="Bairro" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                                <Input placeholder="Bairro" disabled={loadCEP} />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={7}>
                                            <Form.Item name="CITY_ID" label="Cidade" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                                <SelectSearch effect={city} placeholder="Cidade" disabled={loadCEP} url="/city/select.php" value={form.getFieldValue('CITY_ID')} change={(v:any) => form.setFieldValue('CITY_ID', v.value)}/>
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={3}>
                                            <Form.Item name="STATE_ID" label="Estado" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                                <SelectSearch effect={state} placeholder="Estado" disabled={loadCEP} url="/state/select.php" value={form.getFieldValue('STATE_ID')} change={(v:any) => form.setFieldValue('STATE_ID', v.value)}/>
                                            </Form.Item>
                                        </Col>
                                        </>
                                    ) : null }
                                    { doc ? (
                                        <>
                                            <Col xs={24} md={8}>
                                                <Form.Item name="RESPONSIBLE_NAME" label="Resp. - Nome">
                                                    <Input placeholder="Resp. - Nome" />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={4}>
                                                <Form.Item name="RESPONSIBLE_CPF" label="Resp. - CPF">
                                                    <Input placeholder="Resp. - CPF" onKeyPress={MaskCPF} maxLength={14} />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={6}>
                                                <Form.Item name="RESPONSIBLE_OFFICE" label="Resp. - Cargo">
                                                    <Input placeholder="Resp. - Cargo" />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={6}>
                                                <Form.Item name="RESPONSIBLE_DEPARTMENT" label="Resp. - Departamento">
                                                    <Input placeholder="Resp. - Departamento" />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={7}>
                                                <Form.Item name="RESPONSIBLE_EMAIL_01" label="Resp. - E-mail Principal">
                                                    <Input placeholder="Resp. - E-mail Principal" />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={7}>
                                                <Form.Item name="RESPONSIBLE_EMAIL_02" label="Resp. - E-mail Secundário">
                                                    <Input placeholder="Resp. - E-mail Secundário" />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={5}>
                                                <Form.Item name="RESPONSIBLE_PHONE_01" label="Resp. - Telefone Principal">
                                                    <Input placeholder="Resp. - Telefone Principal" />
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} md={5}>
                                                <Form.Item name="RESPONSIBLE_PHONE_02" label="Resp. - Telefone Secundário">
                                                    <Input placeholder="Resp. - Telefone Secundário" />
                                                </Form.Item>
                                            </Col>
                                        </>
                                    ) : null }
                                    <Col span={24}>
                                        <Button shape="round" htmlType="submit" type="primary" style={{float: 'right', marginLeft: 6}} loading={loadButton}>Salvar</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </CardItem>
                    </Col>
                </Row>
            : <LoadItem /> }
        </PageDefault>
    )

}

export default MeuPerfil;