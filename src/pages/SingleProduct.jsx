import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import DefaultPageContainer from '../layouts/Containers/DefaultPageContainer';

const SingleProduct = () => {
  const { nome } = useParams();
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
        const details = await response.json();
        setProduto(details);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      }
    };

    fetchProduto();
  }, [nome]);

  if (!produto) return <p>Carregando...</p>;

  return (
    <DefaultPageContainer>
        <div>
        <h1>{produto.name}</h1>
        <img src={produto.sprites.front_default} alt={produto.name} />
        <p>Peso: {produto.weight}</p>
        <p>Experiência base: {produto.base_experience}</p>
        </div>
    </DefaultPageContainer>
  );
};

export default SingleProduct;
