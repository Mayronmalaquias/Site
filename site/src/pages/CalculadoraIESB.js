import React, { useMemo, useState } from 'react';
import '../assets/css/styles.css';

const MEDIA_MINIMA = 5;
const PESO_A1_FINAL = 0.4;
const PESO_A2_FINAL = 0.6;

function limparNumero(valor, maximoEmCentavos = 1000) {
  const apenasNumeros = String(valor).replace(/\D/g, '');

  if (!apenasNumeros) {
    return '';
  }

  const numero = Number(apenasNumeros);
  const limitado = Math.min(numero, maximoEmCentavos);

  return String(limitado);
}

function paraNumero(valorTexto) {
  return Number(valorTexto || 0) / 100;
}

function formatar(valor) {
  return Number(valor || 0).toFixed(2);
}

function formatarEntrada(valorTexto) {
  return formatar(paraNumero(valorTexto));
}

function limitar(valor, minimo, maximo) {
  return Math.min(Math.max(valor, minimo), maximo);
}

function calcularMediaFinal(a1, a2) {
  return a1 * PESO_A1_FINAL + a2 * PESO_A2_FINAL;
}

function calcularA2Necessaria(a1) {
  return (MEDIA_MINIMA - a1 * PESO_A1_FINAL) / PESO_A2_FINAL;
}

function calcularMencao(media) {
  if (media >= 9) {
    return {
      sigla: 'SS',
      nome: 'Superior',
      situacao: 'Aprovado',
      classe: 'aprovado',
    };
  }

  if (media >= 7) {
    return {
      sigla: 'MS',
      nome: 'Médio Superior',
      situacao: 'Aprovado',
      classe: 'aprovado',
    };
  }

  if (media >= 5) {
    return {
      sigla: 'MM',
      nome: 'Médio',
      situacao: 'Aprovado',
      classe: 'aprovado',
    };
  }

  if (media >= 3) {
    return {
      sigla: 'MI',
      nome: 'Médio Inferior',
      situacao: 'Reprovado',
      classe: 'reprovado',
    };
  }

  if (media > 0) {
    return {
      sigla: 'II',
      nome: 'Inferior',
      situacao: 'Reprovado',
      classe: 'reprovado',
    };
  }

  return {
    sigla: 'SR',
    nome: 'Sem rendimento',
    situacao: 'Reprovado',
    classe: 'reprovado',
  };
}

function textoNotaNecessaria(nota, limite = 10) {
  if (nota <= 0) {
    return 'Você já passa mesmo tirando 0.00.';
  }

  if (nota > limite) {
    return `Não dá para fechar, mesmo tirando ${formatar(limite)}.`;
  }

  return `Você precisa tirar ${formatar(nota)}.`;
}

function CampoNota({
  label,
  valor,
  setValor,
  ajuda,
  maximoEmCentavos = 1000,
}) {
  return (
    <div className="campo-nota">
      <label>{label}</label>

      <input
        type="text"
        inputMode="numeric"
        value={formatarEntrada(valor)}
        onChange={(e) =>
          setValor(limparNumero(e.target.value, maximoEmCentavos))
        }
        onFocus={(e) => e.target.select()}
        placeholder="0.00"
      />

      {ajuda && <small>{ajuda}</small>}
    </div>
  );
}

function CardResultado({ titulo, valor, texto, destaque, classeExtra = '' }) {
  return (
    <div className={`card-resultado ${destaque ? 'destaque' : ''} ${classeExtra}`}>
      <span>{titulo}</span>
      <strong>{valor}</strong>
      {texto && <p>{texto}</p>}
    </div>
  );
}

const CalculadoraNotas = () => {
  const [notaA1, setNotaA1] = useState('');
  const [notaA2, setNotaA2] = useState('');

  const [pesoProvaA2, setPesoProvaA2] = useState('80');
  const [trabalhoA2, setTrabalhoA2] = useState('');

  const [provaDiferente, setProvaDiferente] = useState(false);
  const [valorTotalProva, setValorTotalProva] = useState('');

  const calculoPrincipal = useMemo(() => {
    const a1 = paraNumero(notaA1);
    const a2 = paraNumero(notaA2);

    const media = calcularMediaFinal(a1, a2);
    const mencao = calcularMencao(media);
    const a2Necessaria = calcularA2Necessaria(a1);

    return {
      a1,
      a2,
      media,
      mencao,
      a2Necessaria,
    };
  }, [notaA1, notaA2]);

  const simulacaoA2 = useMemo(() => {
    const a1 = calculoPrincipal.a1;

    /*
      A pessoa digita 0.80.
      Isso significa que a prova tem peso 0.80,
      ou seja, vale 8.00 pontos dentro da A2.
    */
    const pesoProvaCoeficiente = limitar(paraNumero(pesoProvaA2), 0.01, 1);
    const pesoProvaEmPontos = pesoProvaCoeficiente * 10;

    /*
      Se a prova vale 8.00 pontos, o trabalho vale 2.00 pontos.
      O trabalho entra somando direto.
    */
    const pesoTrabalhoEmPontos = limitar(10 - pesoProvaEmPontos, 0, 10);

    const trabalho = limitar(
      paraNumero(trabalhoA2),
      0,
      pesoTrabalhoEmPontos
    );

    const totalProvaReal = paraNumero(valorTotalProva);
    const a2Necessaria = calcularA2Necessaria(a1);

    /*
      CASO NORMAL:
      A2 = prova + trabalho

      Exemplo:
      A1 = 4.50
      A2 necessária = 5.33
      trabalho = 2.00
      prova necessária = 5.33 - 2.00 = 3.33

      Não divide por 0.80 nesse caso.
      A prova já vale 8.00 pontos na composição.
    */
    const pontosNecessariosNaProva = a2Necessaria - trabalho;

    let provaNecessariaFinal = pontosNecessariosNaProva;
    let limiteProva = pesoProvaEmPontos;

    /*
      CASO ESPECIAL:
      A prova foi aplicada com uma pontuação diferente do peso.

      Exemplo:
      A prova tem peso 8.00 na A2,
      mas foi aplicada valendo 10.00.

      Se precisa de 3.33 pontos dentro da A2:
      nota real necessária = 3.33 / 8.00 * 10.00 = 4.16
    */
    if (provaDiferente && totalProvaReal > 0 && pesoProvaEmPontos > 0) {
      provaNecessariaFinal =
        (pontosNecessariosNaProva / pesoProvaEmPontos) * totalProvaReal;

      limiteProva = totalProvaReal;
    }

    const a2MaximaPossivel = pesoProvaEmPontos + trabalho;
    const mediaMaximaSemP3 = calcularMediaFinal(a1, a2MaximaPossivel);

    return {
      pesoProvaCoeficiente,
      pesoProvaEmPontos,
      pesoTrabalhoEmPontos,
      trabalho,
      totalProvaReal,
      a2Necessaria,
      pontosNecessariosNaProva,
      provaNecessariaFinal,
      limiteProva,
      a2MaximaPossivel,
      mediaMaximaSemP3,
    };
  }, [
    calculoPrincipal.a1,
    pesoProvaA2,
    trabalhoA2,
    provaDiferente,
    valorTotalProva,
  ]);

  const calculoP3 = useMemo(() => {
    const a1 = calculoPrincipal.a1;
    const a2 = calculoPrincipal.a2;

    const mediaAtual = calcularMediaFinal(a1, a2);

    /*
      P3 substituindo A1:
      MF = 0.4 * P3 + 0.6 * A2

      P3 substituindo A2:
      MF = 0.4 * A1 + 0.6 * P3
    */
    const p3SubstituindoA1 =
      (MEDIA_MINIMA - PESO_A2_FINAL * a2) / PESO_A1_FINAL;

    const p3SubstituindoA2 =
      (MEDIA_MINIMA - PESO_A1_FINAL * a1) / PESO_A2_FINAL;

    const opcoes = [
      {
        substitui: 'A1',
        nota: Math.max(p3SubstituindoA1, 0),
      },
      {
        substitui: 'A2',
        nota: Math.max(p3SubstituindoA2, 0),
      },
    ];

    const melhorOpcao = opcoes.sort((a, b) => a.nota - b.nota)[0];

    if (mediaAtual >= MEDIA_MINIMA) {
      return {
        precisa: false,
        notaNecessaria: 0,
        substitui: 'Nenhuma',
        mediaAtual,
        texto: 'Você já fecha a média sem precisar de P3.',
      };
    }

    return {
      precisa: true,
      notaNecessaria: melhorOpcao.nota,
      substitui: melhorOpcao.substitui,
      mediaAtual,
      texto: textoNotaNecessaria(melhorOpcao.nota),
    };
  }, [calculoPrincipal.a1, calculoPrincipal.a2]);

  function limparTudo() {
    setNotaA1('');
    setNotaA2('');
    setPesoProvaA2('80');
    setTrabalhoA2('');
    setProvaDiferente(false);
    setValorTotalProva('');
  }

  return (
    <main className="calculadora-page simples">
      <section className="calculadora-hero simples">
        <div>
          <span className="tag">IESB</span>
          <h1>Calculadora de Notas</h1>
          <p>
            Digite só números. Para colocar <strong>8.50</strong>, digite{' '}
            <strong>850</strong>. Para peso <strong>0.80</strong>, digite{' '}
            <strong>80</strong>.
          </p>
        </div>

        <button type="button" className="botao-limpar" onClick={limparTudo}>
          Limpar
        </button>
      </section>

      <section className="card card-principal">
        <div className="cabecalho-card">
          <div>
            <span className="numero-bloco">1</span>
            <h2>Coloque sua A1 e A2</h2>
          </div>

          <p>A média final é sempre 40% da A1 + 60% da A2.</p>
        </div>

        <div className="grid-campos dois">
          <CampoNota
            label="Nota A1"
            valor={notaA1}
            setValor={setNotaA1}
            ajuda="Exemplo: para 7.50, digite 750."
          />

          <CampoNota
            label="Nota A2"
            valor={notaA2}
            setValor={setNotaA2}
            ajuda="Se ainda não sabe sua A2, deixe 0.00."
          />
        </div>

        <div className="resultados-grid tres">
          <CardResultado
            titulo="Média final"
            valor={formatar(calculoPrincipal.media)}
            destaque
          />

          <CardResultado
            titulo="Menção"
            valor={calculoPrincipal.mencao.sigla}
            texto={`${calculoPrincipal.mencao.nome} — ${calculoPrincipal.mencao.situacao}`}
            classeExtra={calculoPrincipal.mencao.classe}
          />

          <CardResultado
            titulo="A2 necessária"
            valor={formatar(Math.max(calculoPrincipal.a2Necessaria, 0))}
            texto={textoNotaNecessaria(calculoPrincipal.a2Necessaria)}
          />
        </div>
      </section>

      <section className="card">
        <div className="cabecalho-card">
          <div>
            <span className="numero-bloco">2</span>
            <h2>Quanto preciso tirar na prova da A2?</h2>
          </div>

          <p>Use quando você já sabe a A1 e tem nota de trabalho da A2.</p>
        </div>

        <div className="grid-campos dois">
          <CampoNota
            label="Peso da prova da A2"
            valor={pesoProvaA2}
            setValor={setPesoProvaA2}
            maximoEmCentavos={100}
            ajuda={`Peso ${formatar(simulacaoA2.pesoProvaCoeficiente)} = prova valendo ${formatar(simulacaoA2.pesoProvaEmPontos)} ponto(s). Trabalho até ${formatar(simulacaoA2.pesoTrabalhoEmPontos)}.`}
          />

          <CampoNota
            label="Nota do trabalho da A2"
            valor={trabalhoA2}
            setValor={setTrabalhoA2}
            maximoEmCentavos={Math.round(simulacaoA2.pesoTrabalhoEmPontos * 100)}
            ajuda="O trabalho entra somando direto."
          />
        </div>

        <label className="toggle-linha opcao-avancada">
          <input
            type="checkbox"
            checked={provaDiferente}
            onChange={(e) => setProvaDiferente(e.target.checked)}
          />

          <span>A prova foi aplicada com pontuação diferente do peso?</span>
        </label>

        {provaDiferente && (
          <div className="painel-avancado">
            <CampoNota
              label="Valor total da prova"
              valor={valorTotalProva}
              setValor={setValorTotalProva}
              maximoEmCentavos={100000}
              ajuda="Exemplo: se a prova tem peso 8.00, mas foi aplicada valendo 10.00, digite 1000."
            />

            <div className="aviso">
              <p>
                O sistema converte automaticamente. Se a prova tem peso 8.00,
                mas foi aplicada valendo 10.00, ele mostra quanto você precisa
                tirar de 10.00.
              </p>
            </div>
          </div>
        )}

        <div className="resultado-prova-necessaria simples">
          <span>
            {provaDiferente
              ? 'Nota necessária na prova real'
              : 'Nota necessária na prova da A2'}
          </span>

          <strong>
            {formatar(Math.max(simulacaoA2.provaNecessariaFinal, 0))}
          </strong>

          <p>
            {textoNotaNecessaria(
              simulacaoA2.provaNecessariaFinal,
              simulacaoA2.limiteProva
            )}
          </p>
        </div>

        <div className="resultados-grid dois">
          <CardResultado
            titulo="A2 máxima possível"
            valor={formatar(simulacaoA2.a2MaximaPossivel)}
            texto="Considerando nota máxima na prova da A2."
          />

          <CardResultado
            titulo="Média máxima sem P3"
            valor={formatar(simulacaoA2.mediaMaximaSemP3)}
            texto={
              simulacaoA2.mediaMaximaSemP3 >= MEDIA_MINIMA
                ? 'Ainda dá para passar sem P3.'
                : 'Nesse cenário, você precisaria considerar a P3.'
            }
          />
        </div>
      </section>

      <section className="card">
        <div className="cabecalho-card">
          <div>
            <span className="numero-bloco">3</span>
            <h2>E se eu precisar de P3?</h2>
          </div>

          <p>
            A P3 substitui A1 ou A2, escolhendo o resultado mais favorável.
          </p>
        </div>

        <div className="resultados-grid dois">
          <CardResultado
            titulo="P3 necessária"
            valor={
              calculoP3.precisa
                ? formatar(calculoP3.notaNecessaria)
                : 'Não precisa'
            }
            destaque={calculoP3.precisa}
            texto={calculoP3.texto}
          />

          <CardResultado
            titulo="Melhor substituição"
            valor={calculoP3.substitui}
            texto={
              calculoP3.precisa
                ? `Nesse cenário, a P3 deve substituir a ${calculoP3.substitui}.`
                : 'Você já fecha a média sem substituir nota.'
            }
          />
        </div>

        {calculoP3.precisa && calculoP3.notaNecessaria > 10 && (
          <div className="status-card atencao">
            <strong>Atenção</strong>
            <span>
              Mesmo com P3, esse cenário não fecha a média. Revise as notas
              informadas.
            </span>
          </div>
        )}
      </section>
    </main>
  );
};

export default CalculadoraNotas;