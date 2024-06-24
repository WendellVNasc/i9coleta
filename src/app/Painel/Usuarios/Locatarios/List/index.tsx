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
  TableTrRecoverButton,
  TableTrTrashButton,
  TableTrashButton,
} from "../../../../../components/Table/buttons";

const LocatariosList = ({ type, path, permission }: PageDefaultProps) => {
  // ESTADOS DO COMPONENTE
  const [action, setAction] = useState(false);

  // DEFINE COLUNAS DA TABELA
  const column = [
    {
      title: "Foto",
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
      table: "photo",
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
      dataIndex: "city.state.acronym",
      table: "city.state.acronym",
      width: "80px",
      sorter: true,
      align: "center",
      render: null,
    },
    {
      title: "Ações",
      dataIndex: null,
      width: "100px",
      sorter: false,
      align: "center",
      render: (item: any) => (
        <Row justify={"center"} style={{ width: "100%" }}>
          <TableTrEditButton type={type} permission={permission} item={item} />
          <TableTrTrashButton
            type={type}
            permission={permission}
            item={item}
            action={() => setAction(!action)}
            path="client"
          />
          <TableTrRecoverButton
            type={type}
            permission={permission}
            item={item}
            action={() => setAction(!action)}
            path="client"
          />
          <TableTrPassword
            type={type}
            permission={permission}
            item={item}
            action={() => setAction(!action)}
            path="client"
          />
        </Row>
      ),
    },
  ];

  return (
    <PageDefault
      valid={`${permission}.${type}`}
      items={[
        { title: <Link to={type === "list" ? "#" : ".."}>Locatários</Link> },
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
                  name: "state",
                  label: "Estado",
                  url: "/state",
                  labelField: ["acronym", "name"],
                },
                {
                  type: "search",
                  name: "city",
                  label: "Cidade",
                  url: "/city",
                  labelField: "name",
                },
              ]}
            />
          </CardItem>
        </Col>
      </Row>
    </PageDefault>
  );
};

export default LocatariosList;
