/* eslint-disable no-unused-expressions */
import './styles.css';
import '../../styles/global.css';
import { Link, useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { schemaLogin } from '../../validation/schema';
import { postNaoAutenticado } from '../../services/apiClient';
import useAuth from '../../hooks/useAuth';
import InputPassword from '../../components/inputPassword';
import { toastEmail, toastSenha } from '../../validation/toastfy';

import illustrationCenter from '../../assets/image-login.svg';

export default function SignIn() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    mode: 'onSubmit',
    reValidateMode: '',
    defaultValues: {},
    context: undefined,
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: true,
    resolver: yupResolver(schemaLogin)
  });
  const [password, setPassword] = useState('');
  const [carregando, setCarregando] = useState(false);
  const history = useHistory();
  const { logar } = useAuth();
  const customId = 'custom-id-yes';

  async function onSubmit(data) {
    setCarregando(true);
    try {
      const { dados, ok } = await postNaoAutenticado('/login', data);
      setCarregando(false);

      if (!ok) {
        toast.error(dados, { toastId: customId });
        return;
      }
      logar(dados.usuario, dados.tokenUsuario);
      history.push('/restaurantes');
    } catch (error) {
      toast.error(error.message, { toastId: customId });
    }
    setCarregando(false);
  }

  if (errors.email) {
    toastEmail();
  }
  if (errors.senha) {
    toastSenha();
  }

  return (
    <div className="bodyLogin">
      <div className="transpBox"> </div>
      <div className="conteinerFormLogin">
        <div className="formLogin">
          <div className="flexRow mt2rem ml2rem selfStart">
            <h1>Login</h1>
          </div>
          <div className=" flexColumn mb1rem mt2rem">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flexColumn mb1rem">
                <label htmlFor="email">Email</label>
                <input id="email" type="text" {...register('email')} />
              </div>
              <InputPassword
                id="senha"
                label="Senha"
                register={() => register('senha')}
                value={password}
                setValue={setPassword}
              />
              <div className="flexRow contentCenter mt1rem mb1rem">
                <button className="btLaranja" type="submit"> Entrar </button>
              </div>
            </form>
            <div className="flexRow contentCenter mt2rem">
              <span className="mr06rem">Ainda não tem uma conta?</span>
              <Link to="/cadastro">Cadastre-se</Link>
            </div>
          </div>
        </div>
        <img className="vetorLogin" src={illustrationCenter} alt="vetor" />
      </div>
    </div>
  );
}
