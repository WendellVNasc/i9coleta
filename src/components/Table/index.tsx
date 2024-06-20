// BIBLIOTECAS REACT
import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Row,
  Typography,
  Pagination,
  Spin,
  Drawer,
  InputNumber,
  Modal,
  Badge,
  Input,
  Skeleton,
  Select,
} from "antd";

// ICONES
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { IoFilter } from "react-icons/io5";

// SERVIÇOS
import { GET_API, POST_API, POST_CATCH, getToken } from "../../services";

// CSS
import "./styles.css";

// COMPONENTES
import SelectSearch from "../SelectSearch";

// INTERFACE
interface TableInterface {
    column: any[],
    path: string,
    type: string,
    action: any,
    useFilter?: any[],
    defaultFilter?: any,
    getList?: any,
}

function Table({
  column,
  path,
  type,
  action,
  useFilter = [],
  defaultFilter = null,
}: TableInterface) {
  // ESTADOS DO COMPONENTE
  const [data, setData] = useState([]);
  const [load, setLoad] = useState([]);
  const [filt, setFilt] = useState(false);
  const [verify, setVerify] = useState(false);
  const [filtLoad, setFiltLoad] = useState(false);
  const [selectColumn, setSelectColumn] = useState(
    column[0].sorter ? column[0].table : column[1].table
  );
  const [search, setSearch] = useState("");
  const [order, setOrder] = useState("ASC");
  const [current, setCurrent] = useState(1);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(10);
  const [filterValues, setFilterValues] = useState({});

  // BUSCA DADOS DA TABELA
  const renderTable = async (
    filter: any,
    pagination: any,
    sorter: any,
    search: any,
    setData: any,
    setTotal: any,
    setLoad: any
  ) => {
    setLoad(true);

    console.log(filter, defaultFilter);
    let url = `/${path}?page=${pagination.current}&per_page=${
      pagination.page
    }&search=${search}&sort=${
      sorter.order == "ASC"
        ? "" + sorter.selectColumn
        : "-" + sorter.selectColumn
    }`;

    Object.entries(filter).forEach(([key, value]) => {
      if (value != undefined && value != null) {
        url += `&${key}=${value}`;
      }
    });

    await GET_API(url)
      .then((response) => {
        if (!response.ok) {
          Modal.warning({ title: "Algo deu errado" });
        }
        response
          .json()
          .then((res) => {
            setData(res.data);
            setTotal(res.meta.total);
            setLoad(false);
          })
          .catch((error) => {});
      })
      .catch((error) => {});
  };

  // ORDENAR TABELA
  const setSelectColumnOrder = (value: string, sorter: string) => {
    if (sorter) {
      if (value === selectColumn) {
        setOrder(order === "ASC" ? "DESC" : "ASC");
      } else {
        setOrder("ASC");
      }
      setSelectColumn(value);
    }
  };

  useEffect(() => {
    verifyFilter();
    renderTable(
      filterValues,
      { current, total, page },
      { selectColumn, order },
      search,
      setData,
      setTotal,
      setLoad
    );
  }, [
    filterValues,
    current,
    total,
    page,
    selectColumn,
    order,
    search,
    type,
    action,
  ]);

  useEffect(() => {
    setCurrent(1);
  }, [type, action]);

  const onFilter = () => {
    setFilt(false);
    renderTable(
      filterValues,
      { current, total, page },
      { selectColumn, order },
      search,
      setData,
      setTotal,
      setLoad
    );
  };

  const verifyFilter = () => {
    var temp: Object = filterValues;
    Object.keys(temp).map((v) => {
      setVerify(temp[v as keyof typeof filterValues] !== "*");
    });
  };

  const onClear = () => {
    var temp: any = filterValues;
    Object.keys(temp).map((v, i) => {
      temp[v] = "*";
    });
    setFilterValues(temp);
    setFiltLoad(true);
    setTimeout(() => {
      setFiltLoad(false);
      onFilter();
    }, 500);
  };

  return (
    <div className="table-content">
      <Row align={"middle"}>
        <Col md={12} xs={4}>
          <Typography className="table-summary">Total:</Typography>
          <Typography className="table-summary-value">{total}</Typography>
        </Col>
        <Col md={12} xs={20}>
          <Row justify="end" align={"middle"} gutter={[4, 4]}>
            <Col>
              <Input
                style={{ width: 200 }}
                placeholder="Perquisar..."
                value={search}
                onChange={(v) => setSearch(v.target.value)}
              />
            </Col>
            {/* <Col><Button onClick={() => Modal.warning({ title: 'Ops...', content: 'Recurso indisponível' })} size="small" type="text" className="site-nav-menu"><SiMicrosoftexcel size={20} /></Button></Col> */}
            {useFilter.length > 0 ? (
              <Col>
                <Badge dot={verify}>
                  <Button
                    shape="circle"
                    onClick={() => setFilt(true)}
                    size="small"
                    type="text"
                    className="site-nav-menu"
                  >
                    <IoFilter size={20} />
                  </Button>
                </Badge>
              </Col>
            ) : null}
          </Row>
        </Col>
        <Col span={24} className="table">
          <Row className="table-header">
            {column.map((v, i) =>
              v.hide ? null : (
                <Col
                  flex={v.width}
                  style={{ minWidth: v.minWidth }}
                  key={i}
                  className={
                    selectColumn === v.table
                      ? "table-header-col active"
                      : "table-header-col"
                  }
                  onClick={() => setSelectColumnOrder(v.table, v.sorter)}
                >
                  <Typography className="table-header-col-title">
                    {v.title}
                  </Typography>
                  {v.sorter ? (
                    <IoMdArrowDropdown
                      className={
                        order === "DESC" && selectColumn === v.table
                          ? "table-header-col-order-down active"
                          : "table-header-col-order-down"
                      }
                    />
                  ) : null}
                  {v.sorter ? (
                    <IoMdArrowDropup
                      className={
                        order === "ASC" && selectColumn === v.table
                          ? "table-header-col-order-up active"
                          : "table-header-col-order-up"
                      }
                    />
                  ) : null}
                </Col>
              )
            )}
          </Row>
          {load ? (
            <Row className="table-body">
              <Col flex="auto" className="table-body-col">
                <Typography className="table-body-col-nodata">
                  <Spin />
                </Typography>
              </Col>
            </Row>
          ) : data.length > 0 ? (
            data.map((v, i) => (
              <Row className="table-body" key={i}>
                {column.map((cv, ci) =>
                  cv.hide ? null : (
                    <Col
                      flex={cv.width}
                      style={{ minWidth: cv.minWidth }}
                      key={ci}
                      className="table-body-col"
                    >
                      {cv.render === null ? (
                        <Typography
                          className="table-header-col-title"
                          style={{ textAlign: cv.align }}
                        >
                          {v[cv.dataIndex]}
                        </Typography>
                      ) : (
                        cv.render(v)
                      )}
                    </Col>
                  )
                )}
              </Row>
            ))
          ) : (
            <Row className="table-body">
              <Col flex="auto" className="table-body-col">
                <Typography className="table-body-col-nodata">
                  Nenhum registro encontrado
                </Typography>
              </Col>
            </Row>
          )}
        </Col>
      </Row>
      <Row justify={"space-between"} style={{ marginTop: 10 }}>
        <InputNumber
          size="small"
          min={1}
          max={100}
          style={{ width: 150, textAlign: "right" }}
          value={page}
          onBlur={(v: any) =>
            setPage(
              v.target.value > 0 && v.target.value <= 100 ? v.target.value : 10
            )
          }
          suffix=" / página"
        />
        <Pagination
          pageSize={page}
          current={current}
          defaultCurrent={current}
          total={total}
          size="small"
          showSizeChanger={false}
          onChange={(page, size) => {
            setCurrent(page);
            setPage(size);
          }}
        />
      </Row>
      <Drawer title="Filtros" open={filt} onClose={() => setFilt(false)}>
        <Row gutter={[18, 18]}>
          {useFilter &&
            useFilter.map((v, i) => (
              <Col span={24} key={i}>
                <Typography style={{ fontSize: "1.2em" }}>{v.label}</Typography>
                {filtLoad ? (
                  <Skeleton.Input block active />
                ) : v.type === "search" ? (
                  <SelectSearch //pesquisa as opções
                    placeholder={v.label}
                    url={v.url}
                    value={filterValues[v as keyof typeof filterValues]}
                    labelField={v.labelField}
                    change={(t: any) =>
                      setFilterValues({ ...filterValues, [v.name]: t?.value })
                    }
                  />
                ) : (
                  <Select
                    style={{ width: "100%" }}
                    placeholder={v.label}
                    value={filterValues[v as keyof typeof filterValues]}
                    onChange={(t: any) =>
                      setFilterValues({ ...filterValues, [v.name]: t })
                    }
                  >
                    {v.items.map((v: any, i: any) => (
                      <Select.Option key={i} value={v.value}>
                        {v.label}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </Col>
            ))}
          <Col span={12}>
            <Button shape="round" type="default" block onClick={onClear}>
              Limpar Filtros
            </Button>
          </Col>
          <Col span={12}>
            <Button shape="round" type="primary" block onClick={onFilter}>
              Filtrar
            </Button>
          </Col>
        </Row>
      </Drawer>
    </div>
  );
}

export default Table;
