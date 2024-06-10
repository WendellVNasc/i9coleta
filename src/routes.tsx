// BIBLIOTECA ROTA
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

// LANDING PAGE
import Landing from './app';
// LOGIN
import Login from './app/Login';
// PAINEL
import Painel from './app/Painel';
// DASHBOARD
import Dashboard from './app/Painel/Dashboard';
// FINANCEIRO
import Financeiro from './app/Painel/Financeiro';
// MEU PERFIL
import MeuPerfil from './app/Painel/MeuPerfil';
// CONFIGURAÇÕES
import Configuracoes from './app/Painel/Configuracoes';
// PEDIR CACAMBA
import FuncoesLocatario from './app/Painel/FuncoesLocatario';
// PRIVILEGIOS
    // GRUPOS DE PERMISSAO
    import GruposDePermissaoList from './app/Painel/Privilegios/GruposDePermissao/List';
    import GruposDePermissaoForm from './app/Painel/Privilegios/GruposDePermissao/Form';
    // PERMISSOES
    import PermissoesList from './app/Painel/Privilegios/Permissoes/List';
    import PermissoesForm from './app/Painel/Privilegios/Permissoes/Form';
    // TIPOS DE USUARIO
    import TiposDeUsuarioList from './app/Painel/Privilegios/TiposDeUsuario/List';
    import TiposDeUsuarioForm from './app/Painel/Privilegios/TiposDeUsuario/Form';
// DADOS DO SISTEMA
    // MODELOS DE CAÇAMBA
    import ModelosDeCacambaList from './app/Painel/DadosDoSistema/ModelosDeCacamba/List';
    import ModelosDeCacambaForm from './app/Painel/DadosDoSistema/ModelosDeCacamba/Form';
    // RESIDUOS
    import ResiduosList from './app/Painel/DadosDoSistema/Residuos/List';
    import ResiduosForm from './app/Painel/DadosDoSistema/Residuos/Form';
    // ESTADOS
    import EstadosList from './app/Painel/DadosDoSistema/Estados/List';
    import EstadosForm from './app/Painel/DadosDoSistema/Estados/Form';
    // CIDADES
    import CidadesList from './app/Painel/DadosDoSistema/Cidades/List';
    import CidadesForm from './app/Painel/DadosDoSistema/Cidades/Form';
// USUARIOS
    // SISTEMA
    import SistemaList from './app/Painel/Usuarios/Sistema/List';
    import SistemaForm from './app/Painel/Usuarios/Sistema/Form';
    // LOCATARIOS
    import LocatariosList from './app/Painel/Usuarios/Locatarios/List';
    import LocatariosForm from './app/Painel/Usuarios/Locatarios/Form';
    // LOCADORES
    import LocadoresList from './app/Painel/Usuarios/Locadores/List';
    import LocadoresForm from './app/Painel/Usuarios/Locadores/Form';
// PRODUTOS
    // CACAMBAS
    import CacambasList from './app/Painel/Produtos/Cacambas/List';
    import CacambasForm from './app/Painel/Produtos/Cacambas/Form';
    import CacambasGaleria from './app/Painel/Produtos/Cacambas/Galeria';
    // ITENS
    import CacambasItensList from './app/Painel/Produtos/Cacambas/Itens/List';
    import CacambasItensForm from './app/Painel/Produtos/Cacambas/Itens/Form';

// COMPONENTES
import Redirect from './components/Redirect';
import EquipeList from './app/Painel/FuncoesLocador/Equipe/List';
import EquipeForm from './app/Painel/FuncoesLocador/Equipe/Form';


import FuncoesLocatarioFornecedor from './app/Painel/FuncoesLocatario/Fornecedor';
import Carrinho from './app/Painel/Carrinho';
import FuncoesLocatarioModelo from './app/Painel/FuncoesLocatario/Modelo';
import FuncoesLocatarioTipoLocal from './app/Painel/FuncoesLocatario/TipoLocal';
import FuncoesLocatarioCacamba from './app/Painel/FuncoesLocatario/Cacamba';
import MeusPedidosList from './app/Painel/FuncoesLocatario/MeusPedidos/List';
import PedidosList from './app/Painel/FuncoesLocador/Pedidos/List';


const RoutesStack = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route path='' element={<Landing />} />
                <Route path='login' element={<Login />} />
                <Route path='painel' element={<Painel />}>
                    <Route path="" element={<Redirect />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="financeiro" element={<Financeiro />} />
                    <Route path="meuperfil" element={<MeuPerfil />} />
                    <Route path="carrinho" element={<Carrinho />} />
                    <Route path="configuracoes" element={<Configuracoes />} />
                    <Route path="meuspedidos" element={<MeusPedidosList type='list' path="order_location" permission='mpd' />} />
                    <Route path="pedircacamba" element={<Outlet />}>
                        <Route path="" element={<FuncoesLocatario />} />
                        <Route path="fornecedor/:ID" element={<FuncoesLocatarioFornecedor />} />
                        <Route path="modelo/:ID" element={<FuncoesLocatarioModelo />} />
                        <Route path="tipolocacao/:TYPE_LOCAL" element={<FuncoesLocatarioTipoLocal />} />
                        <Route path="cacamba/:ID" element={<FuncoesLocatarioCacamba />} />
                    </Route>
                    <Route path="pedidoscacamba" element={<PedidosList type='list' path="order_location" permission='lcc' />} />
                    {/* GRUPO PRIVILEGIOS */}
                        {/* GRUPOS DE PERMISSAO */}
                        <Route path="gruposdepermissao" element={<Outlet />}>
                            <Route path="" element={<GruposDePermissaoList type='list' path="permission_group" permission='gdp' />} />
                            <Route path="lixeira" element={<GruposDePermissaoList type='trash' path="permission_group" permission='gdp' />} />
                            <Route path="novo" element={<GruposDePermissaoForm type='add' path="permission_group" permission='gdp' />} />
                            <Route path=":ID" element={<GruposDePermissaoForm type='edit' path="permission_group" permission='gdp' />} />
                        </Route>
                        {/* PERMISSÕES */}
                        <Route path="permissoes" element={<Outlet />}>
                            <Route path="" element={<PermissoesList type='list' path="permission" permission='prm' />} />
                            <Route path="lixeira" element={<PermissoesList type='trash' path="permission" permission='prm' />} />
                            <Route path="novo" element={<PermissoesForm type='add' path="permission" permission='prm' />} />
                            <Route path=":ID" element={<PermissoesForm type='edit' path="permission" permission='prm' />} />
                        </Route>
                        {/* TIPOS DE USUÁRIO */}
                        <Route path="tiposdeusuario" element={<Outlet />}>
                            <Route path="" element={<TiposDeUsuarioList type='list' path="credential_type" permission='tdu' />} />
                            <Route path="lixeira" element={<TiposDeUsuarioList type='trash' path="credential_type" permission='tdu' />} />
                            <Route path="novo" element={<TiposDeUsuarioForm type='add' path="credential_type" permission='tdu' />} />
                            <Route path=":ID" element={<TiposDeUsuarioForm type='edit' path="credential_type" permission='tdu' />} />
                        </Route>
                    {/* DADOS DO SISTEMA */}
                        {/* MODELOS DE CAÇAMBA */}
                        <Route path="modelosdecacamba" element={<Outlet />}>
                            <Route path="" element={<ModelosDeCacambaList type='list' path="stationary_bucket_type" permission='mcm' />} />
                            <Route path="lixeira" element={<ModelosDeCacambaList type='trash' path="stationary_bucket_type" permission='mcm' />} />
                            <Route path="novo" element={<ModelosDeCacambaForm type='add' path="stationary_bucket_type" permission='mcm' />} />
                            <Route path=":ID" element={<ModelosDeCacambaForm type='edit' path="stationary_bucket_type" permission='mcm' />} />
                        </Route>
                        {/* RESIDUOS */}
                        <Route path="residuos" element={<Outlet />}>
                            <Route path="" element={<ResiduosList type='list' path="reside" permission='rsd' />} />
                            <Route path="lixeira" element={<ResiduosList type='trash' path="reside" permission='rsd' />} />
                            <Route path="novo" element={<ResiduosForm type='add' path="reside" permission='rsd' />} />
                            <Route path=":ID" element={<ResiduosForm type='edit' path="reside" permission='rsd' />} />
                        </Route>
                        {/* ESTADOS */}
                        <Route path="estados" element={<Outlet />}>
                            <Route path="" element={<EstadosList type='list' path="state" permission='etd' />} />
                            <Route path="lixeira" element={<EstadosList type='trash' path="state" permission='etd' />} />
                            <Route path="novo" element={<EstadosForm type='add' path="state" permission='etd' />} />
                            <Route path=":ID" element={<EstadosForm type='edit' path="state" permission='etd' />} />
                        </Route>
                        {/* CIDADES */}
                        <Route path="cidades" element={<Outlet />}>
                            <Route path="" element={<CidadesList type='list' path="city" permission='cdd' />} />
                            <Route path="lixeira" element={<CidadesList type='trash' path="city" permission='cdd' />} />
                            <Route path="novo" element={<CidadesForm type='add' path="city" permission='cdd' />} />
                            <Route path=":ID" element={<CidadesForm type='edit' path="city" permission='cdd' />} />
                        </Route>
                    {/* USUÁRIOS */}
                        {/* SISTEMA */}
                        <Route path="usuarios" element={<Outlet />}>
                            <Route path="" element={<SistemaList type='list' path="credential" permission='usr' />} />
                            <Route path="lixeira" element={<SistemaList type='trash' path="credential" permission='usr' />} />
                            <Route path="novo" element={<SistemaForm type='add' path="credential" permission='usr' />} />
                            <Route path=":ID" element={<SistemaForm type='edit' path="credential" permission='usr' />} />
                        </Route>
                        {/* LOCATARIOS */}
                        <Route path="locatarios" element={<Outlet />}>
                            <Route path="" element={<LocatariosList type='list' path="client" permission='lct' />} />
                            <Route path="lixeira" element={<LocatariosList type='trash' path="client" permission='lct' />} />
                            <Route path="novo" element={<LocatariosForm type='add' path="client" permission='lct' />} />
                            <Route path=":ID" element={<LocatariosForm type='edit' path="client" permission='lct' />} />
                        </Route>
                        {/* LOCADORES */}
                        <Route path="locadores" element={<Outlet />}>
                            <Route path="" element={<LocadoresList type='list' path="provider" permission='lcd' />} />
                            <Route path="lixeira" element={<LocadoresList type='trash' path="provider" permission='lcd' />} />
                            <Route path="novo" element={<LocadoresForm type='add' path="provider" permission='lcd' />} />
                            <Route path=":ID" element={<LocadoresForm type='edit' path="provider" permission='lcd' />} />
                        </Route>
                    {/* PROTUDOS */}
                        {/* CACAMBAS */}
                        <Route path="cacambas" element={<Outlet />}>
                            <Route path="" element={<CacambasList type='list' path="stationary_bucket_group" permission='cmb' />} />
                            <Route path="lixeira" element={<CacambasList type='trash' path="stationary_bucket_group" permission='cmb' />} />
                            <Route path="novo" element={<CacambasForm type='add' path="stationary_bucket_group" permission='cmb' />} />
                            <Route path=":ID" element={<CacambasForm type='edit' path="stationary_bucket_group" permission='cmb' />} />
                            <Route path=":ID/galeria" element={<CacambasGaleria type='edit' path="stationary_bucket_gallery" permission='cmb' />} />
                            <Route path=":ID/itens" element={<Outlet />}>
                                <Route path="" element={<CacambasItensList type='list' path="stationary_bucket" permission='cmb' />} />
                                <Route path="lixeira" element={<CacambasItensList type='trash' path="stationary_bucket" permission='cmb' />} />
                                <Route path="novo" element={<CacambasItensForm type='add' path="stationary_bucket" permission='cmb' />} />
                                <Route path=":ID2" element={<CacambasItensForm type='edit' path="stationary_bucket" permission='cmb' />} />
                            </Route>
                        </Route>
                    {/* FUNCOES LOCADOR */}
                        {/* EQUIPE */}
                        <Route path="equipe" element={<Outlet />}>
                            <Route path="" element={<EquipeList type='list' path="team" permission='eqp' />} />
                            <Route path="lixeira" element={<EquipeList type='trash' path="team" permission='eqp' />} />
                            <Route path="novo" element={<EquipeForm type='add' path="team" permission='eqp' />} />
                            <Route path=":ID" element={<EquipeForm type='edit' path="team" permission='eqp' />} />
                        </Route>
                    <Route path="*" element={<></>} />
                </Route>
            </Routes>
        </BrowserRouter>
    )

}
     
export default RoutesStack;