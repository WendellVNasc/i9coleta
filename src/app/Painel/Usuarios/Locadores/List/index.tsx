// BIBLIOTECAS REACT
import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar, Col, Row } from "antd";

// SERVIÇOS
import { PageDefaultProps } from "../../../../../services";

// COMPONENTES
import PageDefault from "../../../../../components/PageDefault";
import CardItem from "../../../../../components/CardItem";
import Table from "../../../../../components/Table";
import {
  TableNewButton,
  TableReturnButton,
  TableTrEditButton,
  TableTrPassword,
  TableTrPhotoButton,
  TableTrRecoverButton,
  TableTrTrashButton,
  TableTrashButton,
} from "../../../../../components/Table/buttons";

const LocadoresList = ({ type, path, permission }: PageDefaultProps) => {
  // ESTADOS DO COMPONENTE
  const [action, setAction] = useState(false);

  // DEFINE COLUNAS DA TABELA
  const column = [
    {
      title: "Logo",
      dataIndex: "photo",
      table: "photo",
      width: "60px",
      sorter: false,
      align: "center",
      render: (item: any) => (
        <Row justify={"center"} style={{ width: "100%" }}>
          <Avatar src={item.photo ? item.photo : null} />
        </Row>
      ),
    },
    {
      title: "Nome",
      dataIndex: "name",
      table: "name",
      width: "auto",
      sorter: true,
      align: "left",
      render: null,
    },
    {
      title: "CPF/CNPJ",
      dataIndex: "document_number",
      table: "document_number",
      width: "200px",
      sorter: true,
      align: "center",
      render: null,
    },
    {
      title: "Cidade",
      dataIndex: "city.name",
      table: "city.name",
      width: "150px",
      sorter: true,
      align: "center",
      render: null,
    },
    {
      title: "Estado",
      dataIndex: "city.state.name",
      table: "city.state.name",
      width: "100px",
      sorter: true,
      align: "center",
      render: null,
    },
    {
      title: "Ações",
      dataIndex: null,
      width: "120px",
      sorter: false,
      align: "center",
      render: (item: any) => (
        <Row justify={"center"} style={{ width: "100%" }}>
          <TableTrPhotoButton
            type={type}
            permission={permission}
            item={item}
            action={() => setAction(!action)}
          />
          <TableTrEditButton type={type} permission={permission} item={item} />
          <TableTrTrashButton
            type={type}
            permission={permission}
            item={item}
            action={() => setAction(!action)}
            path="user"
          />
          <TableTrRecoverButton
            type={type}
            permission={permission}
            item={item}
            action={() => setAction(!action)}
            path="user"
          />
          <TableTrPassword
            type={type}
            permission={permission}
            item={item}
            action={() => setAction(!action)}
            path="user"
          />
        </Row>
      ),
    },
  ];

  return (
    <PageDefault
      valid={`${permission}.${type}`}
      items={[
        { title: <Link to={type === "list" ? "#" : ".."}>Locadores</Link> },
        { title: type === "list" ? "Lista" : "Lixeira" },
      ]}
      options={
        <Row justify={"end"} gutter={[8, 8]}>
          <TableNewButton type={type} permission={permission} />
          <TableTrashButton type={type} permission={permission} />
          <TableReturnButton type={type} permission={permission} />
        </Row>
      }
    >
      <Row gutter={[16, 16]}>
        <Col md={24} xs={24}>
          <CardItem>
            <Table
              column={column}
              path={path}
              type={type}
              action={action}
              useFilter={[
                {
                  type: "search",
                  name: "STATE_ID",
                  label: "Estado",
                  url: "/state/select.php",
                },
                {
                  type: "search",
                  name: "CITY_ID",
                  label: "Cidade",
                  url: "/city/select.php",
                },
              ]}
            />
          </CardItem>
        </Col>
      </Row>
    </PageDefault>
  );
};

export default LocadoresList;
