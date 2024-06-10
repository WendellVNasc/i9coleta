// BIBLIOTECAS REACT
import { useEffect, useState } from "react";
import { Button, Col, Form, Image, Input, Row, message, Switch } from "antd";
import { Link, useNavigate } from "react-router-dom";

// SERVIÇOS
import { MaskCNPJ, MaskCPF, POST_API, POST_CATCH, setToken } from "../../services";

// ICONES
import { IoIdCardOutline, IoLockOpenOutline } from "react-icons/io5";

// IMAGENS
import logo from '../../assets/images/logos/Logo Completa/PNG_.Completa - Fundo Transparente.png';
import ReactInputMask, { Props } from "react-input-mask";

const Login = () => {

    // RESPONSAVEL PELA ROTA
    const navigate = useNavigate();

    // ESTADOS DO COMPONENTE
    const [ loading, setLoading ] = useState(false);
    const [ doc, setDoc ] = useState(false);

    // FORMULARIO
    const [ form ] = Form.useForm()

    // FUNÇÃO LOGIN
    const onSend = (values: any) => {

        setLoading(true)
        POST_API('/credential/login.php', { token: 'X', master: JSON.stringify(values) }).then(rs => rs.json()).then(res => {
            if (res.return) {
                setToken(res.token)
                navigate('/painel')
            } else {
                message.warning(res.msg)
            }
        }).catch(POST_CATCH).finally(() => {
            setLoading(false)
        })
        
    }

    useEffect(() => {
        form.resetFields()
    }, [doc])

    return (
        <Row className="content-login">
            <Col span={24} className="col-login">
                <div className="card-login">
                    <Row>
                        <Col span={24}>
                            <Image preview={false} src={logo} />
                        </Col>
                        <Form style={{width: '100%'}} onFinish={onSend} form={form}>
                            <Col span={24}>
                                <Form.Item name="LOGIN" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                    <Input onKeyDown={ doc ? MaskCNPJ : MaskCPF } maxLength={ doc ? 18 : 14 } autoComplete="off" placeholder="Login" className="input-coletai9" addonBefore={<IoIdCardOutline />} addonAfter={<Switch size="small" checkedChildren="CNPJ" unCheckedChildren="CPF" onChange={setDoc} checked={doc} />} />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item name="PASS" rules={[{required: true, message: 'Campo obrigatório!'}]}>
                                    <Input addonBefore={<IoLockOpenOutline />} type="password" placeholder="Senha" className="input-coletai9" />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Button type="primary" loading={loading} shape="round" block htmlType="submit">Entrar</Button>
                                <Link to={'#'}><Button type="link" shape="round" block>Crie sua conta!</Button></Link>
                            </Col>
                        </Form>
                    </Row>
                </div>
            </Col>
        </Row>
    )

}

export default Login;