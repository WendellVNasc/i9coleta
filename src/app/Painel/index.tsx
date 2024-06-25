// BIBLIOTECAS REACT
import {
  Avatar,
  Button,
  Col,
  Divider,
  Dropdown,
  Image,
  MenuProps,
  Modal,
  Row,
  Typography,
} from "antd";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import detectUrlChange from "detect-url-change";

// LOGO
import logo from "../../assets/images/logos/Tipografia/PNG_.Tipografia Branca - Fundo Transparente.png";

// SERVIÇOS
import {
  GET_API,
  POST_API,
  POST_CATCH,
  delConfig,
  delToken,
  getProfileName,
  getToken,
  verifyConfig,
} from "../../services";

// ICONES
import { ExclamationCircleOutlined } from "@ant-design/icons";
import {
  RiAlertLine,
  RiMailOpenLine,
  RiNotification2Line,
} from "react-icons/ri";
import {
  IoAppsOutline,
  IoCartOutline,
  IoCashOutline,
  IoConstructOutline,
  IoGridOutline,
  IoIdCardOutline,
  IoLogOutOutline,
  IoMapOutline,
  IoMenu,
  IoPeopleOutline,
  IoSettingsOutline,
  IoStarOutline,
} from "react-icons/io5";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { GoDatabase } from "react-icons/go";
import { PiTruck } from "react-icons/pi";

// COMPONENTES
import MenuItem from "../../components/MenuItem";

// CSS
import "./styles.css";
import {
  TbCalendarCheck,
  TbCalendarEvent,
} from "react-icons/tb";

const Painel = () => {
  // RESPONSÁVEL PELA NAVEGAÇÃO
  const navigate = useNavigate();

  // ESTADOS DO COMPONENTE
  const [url, setUrl] = useState(window.location.href.split("/")[4]);
  const [menu, setMenu] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [dropWarn, setDropWarn] = useState<MenuProps["items"]>([
    {
      key: "*",
      label: (
        <Typography className="painel-drop-title">Atualizações</Typography>
      ),
      disabled: true,
    },
  ]);
  const [dropNotf, setDropNotf] = useState<MenuProps["items"]>([
    {
      key: "*",
      label: (
        <Typography className="painel-drop-title">Notificações</Typography>
      ),
      disabled: true,
    },
  ]);
  const [dropMail, setDropMail] = useState<MenuProps["items"]>([
    {
      key: "*",
      label: <Typography className="painel-drop-title">Mensagens</Typography>,
      disabled: true,
    },
  ]);

  useEffect(() => {
    // FUNÇÃO QUE OBSERVA A MUDANÇA NA ROTA PARA ATUALIZAR MENU ATIVO
    detectUrlChange.on("change", (newUrl) => {
      var params = String(newUrl).split("/");
      setUrl(params[4]);
      setMenu(false);
      if (getToken() == null) navigate("/login");
    });
    // VERIFICAR CARRINHO
    if (verifyConfig("dsh.cln")) {
      POST_API("/cart/self-search.php", { token: getToken() })
        .then((rs) => rs.json())
        .then((res) => {
          if (res.return) {
          }
        })
        .catch(POST_CATCH);
    }
  }, []);

  useEffect(() => {
    GET_API(`/me`)
    .then((rs) => {
      if (rs.ok) {
        return rs.json();
      } else {
        Modal.warning({ title: "Algo deu errado", content: rs.statusText });
      }
    })
    .then((res) => {
      setUser({ name: res.data.name, photo: res.data.photo, profile: getProfileName() })
    })
    .catch(POST_CATCH)
  })

  // FUNÇÃO SAIR DO SISTEMA
  const onLogOut = () => {
    Modal.confirm({
      title: "Sair do sistema?",
      icon: <ExclamationCircleOutlined />,
      cancelText: "Não",
      okText: "Sim",
      onOk() {
        delConfig();
        delToken();
        navigate("/login");
      },
      onCancel() {},
    });
  };

  // MUDAR ESTADO MENU
  const onMenu = () => {
    setMenu(!menu);
  };

  return (
    <Row className="painel">
      <div className="painel-logo">
        <Image preview={false} src={logo} className="painel-logo-img" />
      </div>
      <Col span={24} className="painel-head">
        <Row
          justify={"space-between"}
          align={"middle"}
          className="painel-head-row"
        >
          <Col>
            <IoMenu className="painel-menu" onClick={onMenu} />
          </Col>
          <Col>
            <Row gutter={[8, 8]} align={"middle"}>
              <Col>
                <Dropdown menu={{ items: dropWarn }} arrow>
                  <Button className="painel-head-button">
                    <RiAlertLine />
                  </Button>
                </Dropdown>
              </Col>
              <Col>
                <Dropdown menu={{ items: dropNotf }} arrow>
                  <Button className="painel-head-button">
                    <RiNotification2Line />
                  </Button>
                </Dropdown>
              </Col>
              <Col>
                <Dropdown menu={{ items: dropMail }} arrow>
                  <Button className="painel-head-button">
                    <RiMailOpenLine />
                  </Button>
                </Dropdown>
              </Col>
              {verifyConfig("dsh.cln") ? (
                <Col>
                  {" "}
                  <Link to="/painel/carrinho">
                    <Button className="painel-head-button">
                      <IoCartOutline />
                    </Button>
                  </Link>{" "}
                </Col>
              ) : null}
              <Col>
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "perfil",
                        label: <Link to="/painel/meuperfil">Meu Perfil</Link>,
                        icon: (
                          <IoIdCardOutline color="var(--color01)" size={18} />
                        ),
                      },
                      {
                        key: "configuracoes",
                        label: (
                          <Link to="/painel/configuracoes">Configurações</Link>
                        ),
                        icon: (
                          <IoSettingsOutline color="var(--color01)" size={18} />
                        ),
                      },
                      {
                        key: "sair",
                        label: "Sair",
                        icon: <IoLogOutOutline color="#FFF" size={18} />,
                        style: {
                          backgroundColor: "var(--color04)",
                          color: "#FFF",
                        },
                        onClick: onLogOut,
                      },
                    ],
                  }}
                  arrow
                >
                  <Row gutter={[4, 4]} className="painel-head-user">
                    <Col>
                      <Avatar
                        shape="square"
                        className="painel-head-avatar"
                        src={user?.photo}
                      />
                    </Col>
                    <Col className="painel-head-text">
                      <Typography className="painel-head-typeuser">
                        {user?.profile}
                      </Typography>
                      <Typography className="painel-head-nameuser">
                        {user?.name}
                      </Typography>
                    </Col>
                  </Row>
                </Dropdown>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col span={24} className="painel-body">
        <Row style={{ flexWrap: "nowrap", flexDirection: "row-reverse" }}>
          <Col flex={"auto"} className="painel-content">
            <Outlet />
          </Col>
          <Col
            flex={"auto"}
            className={menu ? "painel-sidebar active" : "painel-sidebar"}
          >
            <div className={"painel-sidebar-content"}>
              <Row
                style={{ flexDirection: "column", padding: "0.6em 0.4em" }}
                align={"middle"}
              >
                <Col>
                  <Avatar
                    className="painel-sidebar-avatar"
                    style={{ transition: "0.2s" }}
                    src={user?.photo}
                  />
                </Col>
                <Col className="painel-sidebar-col">
                  {" "}
                  <Typography className="painel-sidebar-name">
                    {user?.name}
                  </Typography>{" "}
                </Col>
                <Col className="painel-sidebar-col">
                  <Row gutter={[8, 8]} align={"middle"}>
                    <Col>
                      {" "}
                      <Button className="painel-sidebar-button">
                        <RiAlertLine />
                      </Button>{" "}
                    </Col>
                    <Col>
                      {" "}
                      <Button className="painel-sidebar-button">
                        <RiNotification2Line />
                      </Button>{" "}
                    </Col>
                    <Col>
                      {" "}
                      <Button className="painel-sidebar-button">
                        <RiMailOpenLine />
                      </Button>{" "}
                    </Col>
                    {verifyConfig("dsh.cln") ? (
                      <Col>
                        {" "}
                        <Link to="/painel/carrinho">
                          <Button className="painel-sidebar-button">
                            <IoCartOutline />
                          </Button>
                        </Link>{" "}
                      </Col>
                    ) : null}
                  </Row>
                </Col>
              </Row>
              <Divider style={{ margin: "0px" }} />
              <Row
                style={{ marginTop: "0.4em" }}
                className="painel-sidebar-scroll"
              >
                {user !== null ? (
                  <>
                    <MenuItem
                      menu={menu}
                      url={url}
                      permission={[
                        "dsh.devOp",
                        "dsh.fncOp",
                        "dsh.clnOp",
                        "dsh.pltOp",
                        "dsh.mtrOp",
                      ]}
                      route="dashboard"
                      name="Dashboard"
                      icon={<IoGridOutline />}
                    />
                    <MenuItem
                      menu={menu}
                      url={url}
                      permission={[
                        "dsh.devFn",
                        "dsh.fncFi",
                        "dsh.clnFi",
                        "dsh.pltFi",
                      ]}
                      route="financeiro"
                      name="Financeiro"
                      icon={<IoCashOutline />}
                    />
                    <MenuItem
                      menu={menu}
                      url={url}
                      permission={"eta.list"}
                      route="entregasagendadas"
                      name="Entregas Agendadas"
                      icon={<TbCalendarEvent />}
                    />
                    <MenuItem
                      menu={menu}
                      url={url}
                      permission={"eta.list"}
                      route="retiradasagendadas"
                      name="Retiradas Agendadas"
                      icon={<TbCalendarCheck />}
                    />
                    <MenuItem
                      menu={menu}
                      type="group"
                      name="Pedidos"
                      icon={<LiaFileInvoiceDollarSolid />}
                      children={[
                        {
                          url: url,
                          permission: "lcc.list",
                          route: "pedidoscacamba",
                          name: "Pedidos Realizados",
                        },
                        {
                          url: url,
                          permission: "lcc.list",
                          route: "entregaspendentes",
                          name: "Entregas Pendentes",
                        },
                        {
                          url: url,
                          permission: "lcc.list",
                          route: "emtransitolocacao",
                          name: "Em Trânsito Locação",
                        },
                        {
                          url: url,
                          permission: "lcc.list",
                          route: "locadas",
                          name: "Locadas",
                        },
                        {
                          url: url,
                          permission: "lcc.list",
                          route: "aguardandoretirada",
                          name: "Aguardando Retirada",
                        },
                        {
                          url: url,
                          permission: "lcc.list",
                          route: "emtransitodescarte",
                          name: "Em Trânsito Descarte",
                        },
                      ]}
                    />
                    <MenuItem
                      menu={menu}
                      type="group"
                      name="Meus Pedidos"
                      icon={<LiaFileInvoiceDollarSolid />}
                      children={[
                        {
                          url: url,
                          permission: "mpd.list",
                          route: "meuspedidos",
                          name: "Pedidos Realizados",
                        },
                        {
                          url: url,
                          permission: "mpd.list",
                          route: "minhascacambas",
                          name: "Minhas Caçambas",
                        },
                      ]}
                    />
                    <MenuItem
                      menu={menu}
                      url={url}
                      permission={"avl.list"}
                      route="avaliacoes"
                      name="Avaliações"
                      icon={<IoStarOutline />}
                    />
                    <MenuItem
                      menu={menu}
                      url={url}
                      permission={"vcl.list"}
                      route="veiculos"
                      name="Veículos"
                      icon={<PiTruck />}
                    />
                    <MenuItem
                      menu={menu}
                      url={url}
                      permission={"mpd.add"}
                      route="pedircacamba"
                      name="Pedir Caçamba"
                      icon={<IoCartOutline />}
                    />
                    <MenuItem
                      menu={menu}
                      url={url}
                      permission={"dtf.add"}
                      route="destinofinal"
                      name="Destino Final"
                      icon={<IoMapOutline />}
                    />
                    <MenuItem
                      menu={menu}
                      type="group"
                      name="Privilégios"
                      icon={<IoAppsOutline />}
                      children={[
                        {
                          url: url,
                          permission: "gdp.list",
                          route: "gruposdepermissao",
                          name: "Grupos de Permissão",
                        },
                        {
                          url: url,
                          permission: "prm.list",
                          route: "permissoes",
                          name: "Permissões",
                        },
                        {
                          url: url,
                          permission: "tdu.list",
                          route: "tiposdeusuario",
                          name: "Tipos de Usuário",
                        },
                      ]}
                    />
                    <MenuItem
                      menu={menu}
                      type="group"
                      name="Produtos"
                      icon={<IoConstructOutline />}
                      children={[
                        {
                          url: url,
                          permission: "cmb.list",
                          route: "cacambas",
                          name: "Caçambas",
                        },
                      ]}
                    />
                    <MenuItem
                      menu={menu}
                      type="group"
                      name="Usuários"
                      icon={<IoPeopleOutline />}
                      children={[
                        {
                          url: url,
                          permission: "usr.list",
                          route: "usuarios",
                          name: "Sistema",
                        },
                        {
                          url: url,
                          permission: "lct.list",
                          route: "locatarios",
                          name: "Locatários",
                        },
                        {
                          url: url,
                          permission: "lcd.list",
                          route: "locadores",
                          name: "Locadores",
                        },
                        {
                          url: url,
                          permission: "eqp.list",
                          route: "equipe",
                          name: "Equipe",
                        },
                        {
                          url: url,
                          permission: "mtr.list",
                          route: "motoristas",
                          name: "Motoristas",
                        },
                      ]}
                    />
                    <MenuItem
                      menu={menu}
                      type="group"
                      name="Dados do Sistema"
                      icon={<GoDatabase />}
                      children={[
                        {
                          url: url,
                          permission: "tvc.list",
                          route: "tiposdeveiculos",
                          name: "Tipos de Veículos",
                        },
                        {
                          url: url,
                          permission: "mcm.list",
                          route: "modelosdecacamba",
                          name: "Modelos de Caçamba",
                        },
                        {
                          url: url,
                          permission: "rsd.list",
                          route: "residuos",
                          name: "Grupos de Residuo",
                        },
                        {
                          url: url,
                          permission: "etd.list",
                          route: "estados",
                          name: "Estados",
                        },
                        {
                          url: url,
                          permission: "cdd.list",
                          route: "cidades",
                          name: "Cidades",
                        },
                      ]}
                    />
                  </>
                ) : null}
              </Row>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Painel;
