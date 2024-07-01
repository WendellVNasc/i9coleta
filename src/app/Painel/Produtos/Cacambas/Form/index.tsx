// BIBLIOTECAS REACT
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Col,
  Form,
  Input,
  List,
  Modal,
  Radio,
  Row,
  Select,
  Switch,
  Typography,
  message,
} from "antd";
import { TableReturnButton } from "../../../../../components/Table/buttons";

// SERVIÇOS
import {
  GET_API,
  POST_API,
  POST_CATCH,
  PageDefaultProps,
  getToken,
  verifyConfig,
} from "../../../../../services";

// COMPONENTES
import PageDefault from "../../../../../components/PageDefault";
import CardItem from "../../../../../components/CardItem";
import LoadItem from "../../../../../components/LoadItem";
import SelectSearch from "../../../../../components/SelectSearch";
import { TbArrowsRandom } from "react-icons/tb";

const CacambasForm = ({ type, path, permission }: PageDefaultProps) => {
  // RESPONSAVEL PELA ROTA
  const navigate = useNavigate();

  // PARAMETROS
  const { ID } = useParams();

  // ESTADOS DO COMPONENTE
  const [load, setLoad] = useState(true);
  const [loadButton, setLoadButton] = useState(false);
  const [model, setModel] = useState<any>(null);
  const [provider, setProvider] = useState<any>(null);
  const [typeLocal, setTypeLocal] = useState<string>("B");
  const [reside, setReside] = useState<any>([]);
  const [resideSelect, setResideSelect] = useState<any>([]);

  // CAMPOS FORMULARIO
  const [form] = Form.useForm();

  // VERIFICA "NOVO" OU "EDITAR"
  useEffect(() => {
    loadReside();
    if (type === "add") {
      setLoad(false);
    } else {
      setLoad(true);
      GET_API(`/${path}/${ID}`)
        .then((rs) => {
          if (!rs.ok) {
            Modal.warning({ title: "Algo deu errado", content: rs.statusText });
          }
          return rs.json();
        })
        .then((res) => {
          form.setFieldsValue(res.data);
          // setResideSelect(res.data[0].RESIDES);
          setTypeLocal(res.data.type_local);
          setModel({ ID: res.data.stationary_bucket_type_id });
          setProvider({ ID: res.data.provider_id });
        })
        .catch((e: any) => {
          POST_CATCH();
        })
        .finally(() => setLoad(false));
    }
  }, [type, path, form, ID]);

  // CARREGA RESIDUOS
  const loadReside = () => {
    // POST_API('/credential_reside/search.php', { token: getToken() }).then(rs => rs.json()).then(res => {
    //     if (res.return) {
    //         setReside(res.data)
    //     }
    // }).catch(POST_CATCH)
  };

  // FUNÇÃO SALVAR
  const onSend = (values: any) => {
    setLoadButton(true);
    values.ID = ID;
    values.RESIDES = resideSelect;
    POST_API(`/${path}`, values, ID)
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
  };

  const onReside = (value: any, item: any) => {
    setResideSelect({ ...resideSelect, [item.ID]: value });
  };

  return (
    <PageDefault
      valid={`${permission}.${type}`}
      items={[
        { title: <Link to={type === "list" ? "#" : ".."}>Caçambas</Link> },
        { title: type === "add" ? "Novo" : "Editar" },
      ]}
      options={
        <Row justify={"end"} gutter={[8, 8]}>
          <TableReturnButton type={type} permission={permission} />
        </Row>
      }
    >
      <Row gutter={[16, 16]}>
        <Col md={24} xs={24}>
          {load ? (
            <LoadItem />
          ) : (
            <CardItem>
              <Form layout="vertical" form={form} onFinish={onSend}>
                <Row gutter={[8, 8]}>
                  {verifyConfig("prm.list") ? (
                    <Col xs={24} md={24}>
                      <Form.Item
                        name="user_id"
                        label="Locador"
                        rules={[
                          { required: true, message: "Campo obrigatório!" },
                        ]}
                      >
                        <SelectSearch
                          placeholder="Locador"
                          effect={provider}
                          value={form.getFieldValue("user_id")}
                          url="/provider"
                          change={(v: any) =>
                            form.setFieldValue("user_id", v.value)
                          }
                          labelField="name"
                        />
                      </Form.Item>
                    </Col>
                  ) : null}
                  <Col xs={10} md={2}>
                    <Form.Item
                      name="stationary_bucket_type_id"
                      label="Modelo"
                      rules={[
                        { required: true, message: "Campo obrigatório!" },
                      ]}
                    >
                      <SelectSearch
                        placeholder="Modelo"
                        effect={model}
                        value={form.getFieldValue("stationary_bucket_type_id")}
                        url="/stationary_bucket_type"
                        change={(v: any) => {
                          form.setFieldValue(
                            "stationary_bucket_type_id",
                            v.value
                          );
                        }}
                        labelField="name"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={14} md={3}>
                    <Form.Item
                      name="material"
                      label="Material"
                      rules={[
                        { required: true, message: "Campo obrigatório!" },
                      ]}
                    >
                      <Input placeholder="Material" />
                    </Form.Item>
                  </Col>
                  <Col xs={10} md={3}>
                    <Form.Item
                      name="weight"
                      label="Peso"
                      rules={[
                        { required: true, message: "Campo obrigatório!" },
                      ]}
                    >
                      <Input
                        addonAfter="kg"
                        placeholder="Peso"
                        style={{ width: "100%" }}
                        type="number"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={4}>
                    <Form.Item
                      name="color"
                      label="Cores"
                      rules={[
                        { required: true, message: "Campo obrigatório!" },
                      ]}
                    >
                      <Input placeholder="Cores" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={10}>
                    <Form.Item
                      name="type_lid"
                      label="Tipo de Tampa"
                      rules={[
                        { required: true, message: "Campo obrigatório!" },
                      ]}
                    >
                      <Radio.Group>
                        <Radio value={"A"}>Tampa Articulada</Radio>
                        <Radio value={"C"}>Tampa Corrediça</Radio>
                        <Radio value={"S"}>Sem Tampa</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={4}>
                    <Form.Item
                      name="type_local"
                      label="Tipo de Locação"
                      rules={[
                        { required: true, message: "Campo obrigatório!" },
                      ]}
                    >
                      <Select onChange={setTypeLocal}>
                        <Select.Option value={"B"}>
                          Externa e Interna
                        </Select.Option>
                        <Select.Option value={"E"}>
                          Somente Externa
                        </Select.Option>
                        <Select.Option value={"I"}>
                          Somente Interna
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  {typeLocal === "B" || typeLocal === "E" ? (
                    <>
                      <Col xs={10} md={4}>
                        <Form.Item
                          name="days_external"
                          label="Dias Locação Externa"
                          rules={[
                            { required: true, message: "Campo obrigatório!" },
                          ]}
                        >
                          <Input
                            placeholder="Dias Locação Externa"
                            min={1}
                            type="number"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={14} md={4}>
                        <Form.Item
                          name="price_external"
                          label="Preço Locação Externa"
                          rules={[
                            { required: true, message: "Campo obrigatório!" },
                          ]}
                        >
                          <Input
                            placeholder="Preço Locação Externa"
                            min={1}
                            type="number"
                            addonBefore="R$"
                          />
                        </Form.Item>
                      </Col>
                    </>
                  ) : null}
                  {typeLocal === "B" || typeLocal === "I" ? (
                    <>
                      <Col xs={10} md={4}>
                        <Form.Item
                          name="days_internal"
                          label="Dias Locação Interna"
                          rules={[
                            { required: true, message: "Campo obrigatório!" },
                          ]}
                        >
                          <Input
                            placeholder="Dias Locação Interna"
                            min={1}
                            type="number"
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={14} md={4}>
                        <Form.Item
                          name="price_internal"
                          label="Preço Locação Interna"
                          rules={[
                            { required: true, message: "Campo obrigatório!" },
                          ]}
                        >
                          <Input
                            placeholder="Preço Locação Interna"
                            min={1}
                            type="number"
                            addonBefore="R$"
                          />
                        </Form.Item>
                      </Col>
                    </>
                  ) : null}
                  <Col span={24}>
                    <Form.Item label="Resíduos">
                      {reside.length > 0 ? (
                        <List
                          size="small"
                          itemLayout="horizontal"
                          dataSource={reside}
                          renderItem={(item: any) => (
                            <List.Item
                              actions={[
                                <Switch
                                  onChange={(v) => onReside(v, item)}
                                  defaultChecked={resideSelect[item.ID]}
                                />,
                              ]}
                            >
                              <List.Item.Meta
                                title={item.RESIDE_NAME}
                                description={item.RESIDE_DESC}
                              />
                            </List.Item>
                          )}
                        />
                      ) : (
                        <Typography>
                          Nenhum resíduo cadastrado.{" "}
                          <Link to="/painel/configuracoes" target="_blank">
                            Cadastre aqui!
                          </Link>
                        </Typography>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Button
                      shape="round"
                      htmlType="submit"
                      type="primary"
                      style={{ float: "right", marginLeft: 6 }}
                      loading={loadButton}
                    >
                      Salvar
                    </Button>
                    <Link to={".."}>
                      <Button
                        shape="round"
                        type="default"
                        style={{ float: "right" }}
                      >
                        Cancelar
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </Form>
            </CardItem>
          )}
        </Col>
      </Row>
    </PageDefault>
  );
};

export default CacambasForm;
