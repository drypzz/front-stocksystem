import React, { Component } from 'react';
import api from '../../services/api';

import Modal from '../../components/Modal';
import CategoryForm from '../../containers/CategoryForm';
import ProductForm from '../../containers/ProductForm';

import styles from './style.module.css';

// Ícones para os botões (opcional, mas melhora a UI)
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;


export default class Dashboard extends Component {
   constructor(props) {
      super(props);
      this.state = {
         products: [],
         categoriesList: [],
         categoriesMap: {},
         isCategoryModalOpen: false,
         isProductModalOpen: false,
         productToEdit: null,
         categoryToEdit: null,
         loading: true,
         error: null,
      };
   }

   componentDidMount() {
      this.loadData();
   }

   loadData = async () => {
      this.setState({ loading: true, error: null });
      try {
         const [productsResponse, categoriesResponse] = await Promise.all([
            api.get('/product'),
            api.get('/category'),
         ]);

         const categoriesList = categoriesResponse.data?.categories || categoriesResponse.data || [];
         const categoriesMap = {};
         categoriesList.forEach(category => {
            categoriesMap[category.id] = category.name;
         });

         const productsList = productsResponse.data?.products || [];
         this.setState({
            products: productsList,
            categoriesMap: categoriesMap,
            categoriesList: categoriesList,
            loading: false,
         });
      } catch (err) {
         this.setState({
            error: 'Não foi possível carregar os dados. Tente novamente mais tarde.',
            loading: false,
         });
         console.error("Erro ao buscar dados:", err);
      }
   };

   handleOpenEditProductModal = (product) => {
      const sanitizedProduct = { ...product, categoryId: product.categoryId?.toString() || '' };
      this.setState({ productToEdit: sanitizedProduct, isProductModalOpen: true });
   };
   
   handleOpenEditCategoryModal = (category) => {
      const sanitizedCategory = { ...category }
      this.setState({ categoryToEdit: sanitizedCategory, isCategoryModalOpen: true });
   };

   handleDeleteProduct = async (productId) => {
      if (!window.confirm("Tem certeza que deseja EXCLUIR este produto? Esta ação é irreversível.")) return;
      try {
         await api.delete(`/product/${productId}`);
         alert("Produto excluído com sucesso!");
         this.setState(prevState => ({
            products: prevState.products.filter(p => p.id !== productId)
         }));
      } catch (err) {
         alert(err.response?.data?.message || "Erro ao excluir o produto.");
      }
   };
   
   handleDeleteCategory = async (categoryId) => {
      if (!window.confirm("Tem certeza que deseja EXCLUIR esta categoria? Todos os produtos associados ficarão sem categoria.")) return;
      try {
         await api.delete(`/category/${categoryId}`)
         alert("Categoria excluída com sucesso!");
         this.setState(prevState => ({
            categoriesList: prevState.categoriesList.filter(c => c.id !== categoryId)
         }));
      } catch (err) {
         alert(err.response?.data?.message || "Erro ao excluir a categoria.");
      }
   };

   handleOpenCategoryModal = () => this.setState({ categoryToEdit: null, isCategoryModalOpen: true });
   handleCloseCategoryModal = () => this.setState({ isCategoryModalOpen: false, categoryToEdit: null });

   handleOpenProductModal = () => {
      if (!this.state.categoriesList.length) {
         alert("Você precisa cadastrar ao menos uma categoria antes de adicionar um produto.");
         return;
      }
      this.setState({ productToEdit: null, isProductModalOpen: true });
   };
   handleCloseProductModal = () => this.setState({ isProductModalOpen: false, productToEdit: null });

   handleSuccessfulRegistration = () => {
      this.handleCloseProductModal();
      this.handleCloseCategoryModal();
      this.loadData();
   };

   render() {
      const { loading, error, products, categoriesList, categoriesMap, isCategoryModalOpen, isProductModalOpen, productToEdit, categoryToEdit } = this.state;

      return (
         <>
         <div className={styles.container}>
            <div className={styles.dashboardContent}>
               <header className={styles.mainHeader}>
                  <h1 className={styles.mainTitle}>Painel de Gerenciamento</h1>
               </header>
               
               {error && <div className={styles.errorBanner}><p>{error}</p></div>}

               <section className={styles.tableSection}>
               <div className={styles.sectionHeader}>
                  <h2>Categorias</h2>
                  <button className={styles.button} onClick={this.handleOpenCategoryModal} disabled={loading}>+ Nova Categoria</button>
               </div>
               <div className={styles.tableContainer}>
                  <table className={styles.table}>
                     <thead>
                     <tr>
                        <th>ID</th>
                        <th>Nome</th>
                        <th>Ações</th>
                     </tr>
                     </thead>
                     <tbody>
                     {loading ? (
                        [...Array(3)].map((_, i) => (
                           <tr key={i} className={styles.skeletonRow}>
                           <td><div className={styles.skeletonText} style={{width: '40%'}}></div></td>
                           <td><div className={styles.skeletonText} style={{width: '70%'}}></div></td>
                           <td><div className={styles.skeletonText} style={{width: '90%'}}></div></td>
                           </tr>
                        ))
                     ) : categoriesList.length > 0 ? (
                        categoriesList.map(category => (
                           <tr key={category.id}>
                           <td>{category.id}</td>
                           <td>{category.name}</td>
                           <td className={styles.actionsCell}>
                              <button title="Editar Categoria" className={`${styles.tableButton} ${styles.editButton}`} onClick={() => this.handleOpenEditCategoryModal(category)}><EditIcon /></button>
                              <button title="Excluir Categoria" className={`${styles.tableButton} ${styles.deleteButton}`} onClick={() => this.handleDeleteCategory(category.id)}><DeleteIcon /></button>
                           </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan="3" className={styles.emptyText}>Nenhuma categoria encontrada.</td>
                        </tr>
                     )}
                     </tbody>
                  </table>
               </div>
               </section>

               <section className={styles.tableSection}>
               <div className={styles.sectionHeader}>
                  <h2>Produtos</h2>
                  <button className={styles.button} onClick={this.handleOpenProductModal} disabled={loading}>+ Novo Produto</button>
               </div>
               <div className={styles.tableContainer}>
                  <table className={styles.table}>
                     <thead>
                     <tr>
                        <th>Nome do Produto</th>
                        <th>Categoria</th>
                        <th>Preço</th>
                        <th>Qtd.</th>
                        <th>Ações</th>
                     </tr>
                     </thead>
                     <tbody>
                     {loading ? (
                        [...Array(5)].map((_, i) => (
                           <tr key={i} className={styles.skeletonRow}>
                              <td><div className={styles.skeletonText} style={{width: '80%'}}></div></td>
                              <td><div className={styles.skeletonText} style={{width: '60%'}}></div></td>
                              <td><div className={styles.skeletonText} style={{width: '50%'}}></div></td>
                              <td><div className={styles.skeletonText} style={{width: '30%'}}></div></td>
                              <td><div className={styles.skeletonText} style={{width: '90%'}}></div></td>
                           </tr>
                        ))
                     ) : products.length > 0 ? (
                        products.map(product => (
                           <tr key={product.id}>
                           <td>{product.name}</td>
                           <td>{categoriesMap[product.categoryId] || 'N/A'}</td>
                           <td>{Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                           <td>{product.quantity}</td>
                           <td className={styles.actionsCell}>
                              <button title="Editar Produto" className={`${styles.tableButton} ${styles.editButton}`} onClick={() => this.handleOpenEditProductModal(product)}><EditIcon /></button>
                              <button title="Excluir Produto" className={`${styles.tableButton} ${styles.deleteButton}`} onClick={() => this.handleDeleteProduct(product.id)}><DeleteIcon /></button>
                           </td>
                           </tr>
                        ))
                     ) : (
                        <tr>
                           <td colSpan="5" className={styles.emptyText}>Nenhum produto encontrado.</td>
                        </tr>
                     )}
                     </tbody>
                  </table>
               </div>
               </section>

            </div>
         </div>

         <Modal show={isCategoryModalOpen} onClose={this.handleCloseCategoryModal}>
            <CategoryForm 
               show={isCategoryModalOpen} 
               onSuccess={this.handleSuccessfulRegistration} 
               categoryToEdit={categoryToEdit}
            />
         </Modal>

         <Modal show={isProductModalOpen} onClose={this.handleCloseProductModal}>
            <ProductForm
               show={isProductModalOpen}
               onSuccess={this.handleSuccessfulRegistration}
               productToEdit={productToEdit}
               categories={categoriesList}
            />
         </Modal>
         </>
      );
   }
}