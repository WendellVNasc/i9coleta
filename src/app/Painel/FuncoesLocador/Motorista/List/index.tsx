// BIBLIOTECAS REACT
import { useState } from "react";
import { Link } from "react-router-dom";
import { Col, Row } from "antd";

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

const MotoristaList = ({ type, path, permission }: PageDefaultProps) => {
  // ESTADOS DO COMPONENTE
  const [action, setAction] = useState(false);

  // DEFINE COLUNAS DA TABELA
  const column = [
    {
      title: "Login",
      dataIndex: "document_number",
      table: "document_number",
      width: "200px",
      sorter: true,
      align: "center",
      render: null,
    },
    {
      title: "Nome",
      dataIndex: "name",
      table: "name",
      width: "auto",
      minWidth: "240px",
      sorter: true,
      align: "left",
      render: null,
    },
    {
      title: "E-mail",
      dataIndex: "email",
      table: "email",
      width: "200px",
      sorter: true,
      align: "center",
      render: null,
    },
    {
      title: "CNH",
      dataIndex: "cnh",
      table: "cnh",
      width: "200px",
      sorter: true,
      align: "center",
      render: null,
    },
    {
      title: "Vencimento CNH",
      dataIndex: "cnh_expiration_date_format",
      table: "cnh_expiration_date",
      width: "180px",
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
            path={'user'}
          />
          <TableTrRecoverButton
            type={type}
            permission={permission}
            item={item}
            action={() => setAction(!action)}
            path={'user'}
          />
          <TableTrPassword
            type={type}
            permission={permission}
            item={item}
            action={() => setAction(!action)}
            path={'user'}
          />
        </Row>
      ),
    },
  ];

  return (
    <PageDefault
      valid={`${permission}.${type}`}
      items={[
        { title: <Link to={type === "list" ? "#" : ".."}>Motoristas</Link> },
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
            <Table column={column} path={path} type={type} action={action} />
          </CardItem>
        </Col>
      </Row>
    </PageDefault>
  );
};

export default MotoristaList;
