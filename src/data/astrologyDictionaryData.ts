export interface TermFaqItem {
  pergunta: string;
  resposta: string;
}

export interface TermMiniJogo {
  pergunta: string;
  opcoes: {
    texto: string;
    correta: boolean;
    explicacao: string;
  }[];
}

export interface DictionaryTerm {
  id: string;
  slug: string;
  termo: string;
  tituloSEO: string;
  perguntaGoogle: string;
  categoria: 'Planetas & Astros' | 'Conceitos do Mapa' | 'Signos & Elementos' | 'Fases & Movimentos';
  icone: string;
  resumoUmaLinha: string;
  explicacaoEducativa: string;
  chamadaCuriosa: string;
  ganchoCuriosidade?: string;
  oQueSignifica: string;
  oQueSignificaNaAstrologia: string;
  exemploFicticio: string;
  dicaRapida: string;
  miniJogo: TermMiniJogo;
  faq?: TermFaqItem[];
  termosRelacionados?: string[]; // slugs
  ferramentaRelacionada?: {
    nome: string;
    rota: 'daily-message' | 'aureneffect' | 'discover-sign';
  };
}

export const ASTROLOGY_DICTIONARY_TERMS: DictionaryTerm[] = [
  {
    id: 'mercurio-retrogrado',
    slug: 'what-is-mercury-retrograde',
    termo: 'Mercúrio Retrógrado',
    perguntaGoogle: 'O que é Mercúrio Retrógrado?',
    tituloSEO: 'O que é Mercúrio Retrógrado? Significado Simples na Astrologia',
    categoria: 'Planetas & Astros',
    icone: '🪐',
    resumoUmaLinha: 'Quando parece que o planeta da comunicação está andando para trás no céu.',
    explicacaoEducativa: 'Saiba por que Mercúrio retrógrado é tão temido e como ele realmente mexe com as conversas e atrasos do dia a dia.',
    chamadaCuriosa: 'Saiba por que Mercúrio retrógrado é tão temido',
    oQueSignifica:
      'É quando parece que o planeta Mercúrio está andando para trás no céu. Na verdade, ele nunca anda para trás de verdade; é apenas uma ilusão de ótica que temos aqui da Terra, como quando você está dentro de um carro veloz e o carro da pista ao lado parece andar de marcha à ré.',
    oQueSignificaNaAstrologia:
      'Na astrologia, Mercúrio comanda as conversas, as mensagens, as viagens e os aparelhos eletrônicos. Quando ele está retrógrado, esse período é associado a pequenas confusões, mensagens mal interpretadas, atrasos e à necessidade de rever com calma o que já fizemos.',
    exemploFicticio:
      'Imagine que Maria combina de sair com uma amiga no shopping, mas as duas entendem horários diferentes e acabam se desencontrando. Maria brinca: "Só podia ser Mercúrio retrógrado atrapalhando meus planos!".',
    dicaRapida: 'Leia as mensagens duas vezes antes de enviar e confirme os horários com calma.',
    miniJogo: {
      pergunta: 'Seu celular deu uma travadinha ou alguém entendeu sua mensagem de texto de forma errada hoje. Qual a melhor atitude?',
      opcoes: [
        {
          texto: 'Respirar fundo, explicar com carinho e ter paciência ✨',
          correta: true,
          explicacao: 'Perfeito! Em Mercúrio retrógrado, a paciência e a conversa tranquila resolvem qualquer mal-entendido com facilidade!',
        },
        {
          texto: 'Ficar bravo e mandar 20 áudios gritando',
          correta: false,
          explicacao: 'Calma! Isso só vai criar mais confusão. Respire fundo e converse com jeitinho.',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Mercúrio retrógrado é perigoso?',
        resposta: 'Não! É apenas uma época que pede mais calma, paciência e atenção nos detalhes.',
      },
      {
        pergunta: 'Quanto tempo dura o período de Mercúrio retrógrado?',
        resposta: 'Dura cerca de 3 semanas e acontece cerca de 3 a 4 vezes por ano.',
      },
    ],
    termosRelacionados: ['signo-ascendente', 'mapa-astral', 'lua-cheia'],
    ferramentaRelacionada: {
      nome: 'Ver Mensagem Diária de Hoje',
      rota: 'daily-message',
    },
  },
  {
    id: 'signo-ascendente',
    slug: 'what-is-rising-sign',
    termo: 'Ascendente',
    perguntaGoogle: 'O que é Signo Ascendente?',
    tituloSEO: 'O que é Ascendente na Astrologia? O Signo da Sua Primeira Impressão',
    categoria: 'Conceitos do Mapa',
    icone: '🌅',
    resumoUmaLinha: 'O signo que nascia no horizonte quando você nasceu: a sua porta de entrada.',
    explicacaoEducativa: 'Saiba por que o seu ascendente define a primeira impressão que as pessoas têm de você antes mesmo de você falar.',
    chamadaCuriosa: 'Saiba por que o Ascendente é a primeira coisa que notam em você',
    oQueSignifica:
      'É o signo que estava nascendo no horizonte leste no céu no minuto exato em que você nasceu. Por isso, para saber o seu ascendente com precisão, é necessário saber o horário do nascimento.',
    oQueSignificaNaAstrologia:
      'O ascendente é como a sua "fachada" ou a primeira impressão que você passa para o mundo. É o seu jeito de falar, como você começa coisas novas e como as pessoas te enxergam antes de te conhecerem profundamente.',
    exemploFicticio:
      'Lucas é de Peixes (super sensível e tranquilo por dentro), mas tem Ascendente em Áries. Quando chega em uma reunião, ele fala alto, toma a frente e parece mandão. As pessoas se surpreendem quando descobrem o quanto ele é doce.',
    dicaRapida: 'O Ascendente é a roupa que você veste para se apresentar ao mundo.',
    miniJogo: {
      pergunta: 'Quando você chega pela primeira vez em uma festa ou entrevista, o que as pessoas sentem logo de cara?',
      opcoes: [
        {
          texto: 'A energia do seu Ascendente (o seu jeito e primeira impressão)',
          correta: true,
          explicacao: 'Isso mesmo! O Ascendente é a porta de entrada da sua personalidade no mundo.',
        },
        {
          texto: 'A marca do tênis que você esqueceu em casa',
          correta: false,
          explicacao: 'Ninguém adivinha isso! O que aparece de imediato é o seu jeito de se expressar e sua presença.',
        },
      ],
    },
    faq: [
      {
        pergunta: 'O Ascendente é mais forte que o signo do Sol?',
        resposta: 'O Sol é quem você é no fundo do coração; o Ascendente é como as pessoas te veem à primeira vista.',
      },
    ],
    termosRelacionados: ['signo-solar', 'signo-lunar', 'casas-astrologicas'],
    ferramentaRelacionada: {
      nome: 'Calcular no Efeito Auren',
      rota: 'aureneffect',
    },
  },
  {
    id: 'signo-solar',
    slug: 'what-is-sun-sign',
    termo: 'Signo Solar (Seu Signo Principal)',
    perguntaGoogle: 'O que é Signo Solar?',
    tituloSEO: 'O que é Signo Solar? A Sua Essência e Força Vital',
    categoria: 'Signos & Elementos',
    icone: '☀️',
    resumoUmaLinha: 'A posição onde o Sol estava quando você nasceu: a sua bateria de energia.',
    explicacaoEducativa: 'Saiba por que o seu signo solar é o mais famoso de todos e o que ele revela sobre a sua verdadeira fonte de energia e brilho.',
    chamadaCuriosa: 'Saiba por que seu signo solar não conta tudo sobre você',
    oQueSignifica:
      'É a posição onde o Sol estava no céu no dia do seu aniversário. É o signo que todo mundo diz quando pergunta: "Qual é o seu signo?".',
    oQueSignificaNaAstrologia:
      'Representa o seu coração, a sua essência básica, a sua energia e o que te dá vontade de acordar feliz todos os dias.',
    exemploFicticio:
      'Quando Juliana diz que é do signo de Leão, ela se refere ao seu Signo Solar: ela adora comemorar aniversários e espalha bom humor e alegria por onde passa.',
    dicaRapida: 'O Sol é a bateria do seu coração e a sua força vital mais autêntica.',
    miniJogo: {
      pergunta: 'Quando alguém te pergunta "Qual é o seu signo?", de qual posição ela está falando?',
      opcoes: [
        {
          texto: 'Do Signo Solar (onde o Sol estava no dia do seu nascimento)',
          correta: true,
          explicacao: 'Na mosca! O signo solar é o mais conhecido de todos e representa a bateria de luz do seu coração.',
        },
        {
          texto: 'Do horóscopo do jornal da semana retrasada',
          correta: false,
          explicacao: 'Não! O seu signo solar vem da data do seu aniversário e nunca muda ao longo da vida.',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Por que nem todo mundo do mesmo signo é igual?',
        resposta: 'Porque cada pessoa tem uma combinação única de Lua, Ascendente e outros planetas no seu mapa astral.',
      },
    ],
    termosRelacionados: ['signo-lunar', 'signo-ascendente', 'elementos-astrologicos'],
    ferramentaRelacionada: {
      nome: 'Descobrir Meu Signo',
      rota: 'discover-sign',
    },
  },
  {
    id: 'signo-lunar',
    slug: 'what-is-moon-sign',
    termo: 'Lua (Signo Lunar)',
    perguntaGoogle: 'O que é o Signo Lunar?',
    tituloSEO: 'O que significa a Lua no Mapa Astral? Seus Sentimentos Secretos',
    categoria: 'Planetas & Astros',
    icone: '🌙',
    resumoUmaLinha: 'O signo das suas emoções mais profundas e do que te traz conforto.',
    explicacaoEducativa: 'Saiba por que a sua Lua cuida dos seus sentimentos secretos e do que você precisa para se sentir seguro em paz.',
    chamadaCuriosa: 'Saiba por que a Lua manda no seu humor e no seu choro',
    oQueSignifica:
      'É o signo onde a Lua estava no momento exato em que você deu o primeiro respiro no mundo.',
    oQueSignificaNaAstrologia:
      'Enquanto o Sol cuida do que você faz de dia para todo mundo ver, a Lua cuida do que você sente por dentro: suas emoções íntimas, seus medos e como você gosta de ser acolhido.',
    exemploFicticio:
      'Pedro é de Capricórnio (muito focado e sério no trabalho), mas tem a Lua em Câncer. Em casa, ele assiste a desenhos comendo pipoca e se emociona facilmente com histórias de família.',
    dicaRapida: 'A Lua representa a sua criança interior e o seu porto seguro.',
    miniJogo: {
      pergunta: 'Quando você teve um dia cansativo e só quer ficar quietinho no seu canto recebendo carinho, qual astro está falando mais alto?',
      opcoes: [
        {
          texto: 'A Lua (ela cuida das suas emoções íntimas e do seu aconchego)',
          correta: true,
          explicacao: 'Exato! A Lua é o seu cantinho seguro onde você se sente acolhido, descansado e em paz.',
        },
        {
          texto: 'O despertador de segunda-feira de manhã',
          correta: false,
          explicacao: 'O despertador só quer pressa! Quem cuida do seu descanso de verdade é a energia da Lua.',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Como saber qual é a minha Lua?',
        resposta: 'Basta colocar sua data, horário e cidade de nascimento na nossa calculadora gratuita do Efeito Auren.',
      },
    ],
    termosRelacionados: ['signo-solar', 'lua-cheia', 'lua-nova'],
    ferramentaRelacionada: {
      nome: 'Calcular Lua no Efeito Auren',
      rota: 'aureneffect',
    },
  },
  {
    id: 'mapa-astral',
    slug: 'what-is-birth-chart',
    termo: 'Mapa Astral (Mapa Natal)',
    perguntaGoogle: 'O que é um Mapa Astral?',
    tituloSEO: 'O que é Mapa Astral? O Guia Definitivo Explicado de Forma Simples',
    categoria: 'Conceitos do Mapa',
    icone: '🧭',
    resumoUmaLinha: 'Uma fotografia do céu tirada no segundo exato em que você nasceu.',
    explicacaoEducativa: 'Saiba por que o mapa astral é considerado uma fotografia única do céu que funciona como o seu manual pessoal de talentos.',
    chamadaCuriosa: 'Saiba por que seu Mapa Astral é como sua impressão digital no céu',
    oQueSignifica:
      'É uma foto panorâmica do céu no exato instante e cidade em que você nasceu, marcando onde cada planeta e constelação estava.',
    oQueSignificaNaAstrologia:
      'É o seu manual pessoal. Ele mostra seus talentos naturais, onde você tem mais facilidade para ter sucesso e quais pontos você precisa exercitar com mais carinho.',
    exemploFicticio:
      'Carla fez seu mapa astral e entendeu por que gosta tanto de ensinar, mas ao mesmo tempo precisa de momentos em silêncio todos os dias para recarregar as energias.',
    dicaRapida: 'Ninguém no mundo tem um mapa astral 100% igual ao seu.',
    miniJogo: {
      pergunta: 'Para que serve o Mapa Astral na vida real?',
      opcoes: [
        {
          texto: 'Como um mapa de talentos para você se conhecer melhor e fazer boas escolhas',
          correta: true,
          explicacao: 'Muito bem! Ele é como um manual de instruções dos seus dons naturais e da sua essência.',
        },
        {
          texto: 'Para adivinhar os números da loteria da virada',
          correta: false,
          explicacao: 'Astrologia é sobre autoconhecimento e vida prática, não sobre adivinhar loterias!',
        },
      ],
    },
    faq: [
      {
        pergunta: 'O mapa astral prevê o futuro?',
        resposta: 'Não! Ele é como um mapa de navegação que mostra quem você é para você fazer as melhores escolhas.',
      },
    ],
    termosRelacionados: ['casas-astrologicas', 'signo-ascendente', 'retorno-de-saturno'],
    ferramentaRelacionada: {
      nome: 'Calcular Efeito Auren',
      rota: 'aureneffect',
    },
  },
  {
    id: 'retorno-de-saturno',
    slug: 'what-is-saturn-return',
    termo: 'Retorno de Saturno',
    perguntaGoogle: 'O que é o Retorno de Saturno?',
    tituloSEO: 'O que é o Retorno de Saturno aos 29 anos? Entenda Sem Medo',
    categoria: 'Fases & Movimentos',
    icone: '🪐',
    resumoUmaLinha: 'A formatura da vida adulta que acontece por volta dos 28 a 30 anos.',
    explicacaoEducativa: 'Saiba por que o Retorno de Saturno aos 29 anos é tão marcante e como ele transforma de verdade a sua vida adulta.',
    chamadaCuriosa: 'Saiba por que chegar aos 29 anos vira a vida do avesso',
    oQueSignifica:
      'O planeta Saturno demora quase 30 anos para dar uma volta completa em torno do Sol. Quando ele volta para o mesmo lugar de quando você nasceu, temos o Retorno de Saturno.',
    oQueSignificaNaAstrologia:
      'É o momento em que a vida te pergunta: "Você está feliz com o caminho que escolheu?". É uma época em que assumimos responsabilidades reais, mudamos de carreira ou deixamos para trás o que não faz mais sentido.',
    exemploFicticio:
      'Aos 29 anos, Rodrigo largou um trabalho que não aguentava mais e finalmente abriu sua padaria artesanal, assumindo a liderança do seu próprio sonho.',
    dicaRapida: 'O Retorno de Saturno não é castigo; é a vida te ajudando a construir coisas sólidas.',
    miniJogo: {
      pergunta: 'Você chegou perto dos 29 ou 30 anos e sente vontade de mudar de rumo e amadurecer. Qual a melhor atitude?',
      opcoes: [
        {
          texto: 'Assumir as rédeas da sua vida e construir planos que durem de verdade',
          correta: true,
          explicacao: 'Exatamente! Saturno recompensa quem tem coragem de amadurecer e fazer escolhas com o coração.',
        },
        {
          texto: 'Se desesperar e achar que tudo acabou',
          correta: false,
          explicacao: 'Não tem por que se assustar! É uma das fases mais bonitas de crescimento e conquista.',
        },
      ],
    },
    faq: [
      {
        pergunta: 'O Retorno de Saturno acontece mais de uma vez?',
        resposta: 'Sim, por volta dos 29 anos e novamente por volta dos 58 anos de idade.',
      },
    ],
    termosRelacionados: ['mapa-astral', 'casas-astrologicas', 'revolucao-solar'],
    ferramentaRelacionada: {
      nome: 'Ler Mensagem Diária',
      rota: 'daily-message',
    },
  },
  {
    id: 'casas-astrologicas',
    slug: 'what-are-astrological-houses',
    termo: 'Casas Astrológicas',
    perguntaGoogle: 'O que são as 12 Casas Astrológicas?',
    tituloSEO: 'O que são as Casas Astrológicas? A Pizza das 12 Áreas da Vida',
    categoria: 'Conceitos do Mapa',
    icone: '🏠',
    resumoUmaLinha: 'As 12 divisões do mapa que representam cada assunto da sua vida.',
    explicacaoEducativa: 'Saiba por que o mapa astral é dividido em 12 casas e como cada uma cuida de uma área como amor, dinheiro e trabalho.',
    chamadaCuriosa: 'Saiba como a astrologia divide a sua vida em 12 áreas secretas',
    oQueSignifica:
      'Imagine que o mapa astral é uma pizza redonda fatiada em 12 pedaços iguais. Cada pedaço do céu é chamado de "casa".',
    oQueSignificaNaAstrologia:
      'Cada casa cuida de um tema: a Casa 1 cuida de você, a Casa 2 do dinheiro, a Casa 4 da sua casa e família, a Casa 7 dos amores e parcerias, e a Casa 10 da sua carreira.',
    exemploFicticio:
      'Se você tem vários planetas reunidos na Casa 4, seu lar é o lugar mais sagrado da sua vida e você adora receber pessoas queridas em casa.',
    dicaRapida: 'Os signos mostram COMO você sente; as casas mostram ONDE as coisas acontecem.',
    miniJogo: {
      pergunta: 'Se o mapa astral fosse uma casa de verdade, o que as 12 casas astrológicas seriam?',
      opcoes: [
        {
          texto: 'Os cômodos da casa: quarto do amor, cozinha da família, escritório do trabalho',
          correta: true,
          explicacao: 'Show! Cada casa cuida de um cantinho importante da sua rotina e da sua vida.',
        },
        {
          texto: 'Doze tijolos quebrados na calçada',
          correta: false,
          explicacao: 'Elas são divisões com significado profundo para cada sonho seu!',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Todo mundo tem todas as 12 casas?',
        resposta: 'Sim! Todos nós temos as 12 casas no mapa, mesmo as que não têm planetas dentro.',
      },
    ],
    termosRelacionados: ['signo-ascendente', 'mapa-astral', 'venus-no-mapa'],
    ferramentaRelacionada: {
      nome: 'Ver Efeito Auren',
      rota: 'aureneffect',
    },
  },
  {
    id: 'venus-no-mapa',
    slug: 'what-does-venus-mean',
    termo: 'Vênus (O Planeta do Amor)',
    perguntaGoogle: 'O que Vênus significa na Astrologia?',
    tituloSEO: 'O que Vênus Representa na Astrologia? Seu Estilo de Amar e Seduzir',
    categoria: 'Planetas & Astros',
    icone: '💖',
    resumoUmaLinha: 'O planeta do amor, da beleza, dos prazeres e de como você se relaciona.',
    explicacaoEducativa: 'Saiba por que Vênus é tão famoso no amor e como ele mostra o tipo de carinho e afeto que realmente conquista você.',
    chamadaCuriosa: 'Saiba por que Vênus define quem você ama e quem te atrai',
    oQueSignifica:
      'É o planeta brilhante que vemos no início da noite ou ao amanhecer, conhecido popularmente como Estrela d’Alva.',
    oQueSignificaNaAstrologia:
      'Vênus mostra o seu jeito de amar, o que você acha bonito, o que te dá prazer e como você gosta de ser tratado por quem você ama.',
    exemploFicticio:
      'Beatriz tem Vênus em Touro. Para ela, carinho bom é um jantar caprichado feito em casa com direito a sobremesa gostosa.',
    dicaRapida: 'Vênus revela a sua linguagem do amor favorita.',
    miniJogo: {
      pergunta: 'Se você quer saber qual tipo de carinho faz seu coração bater mais forte, qual astro te ensina isso?',
      opcoes: [
        {
          texto: 'O planeta Vênus (o mestre do amor, do afeto e dos prazeres)',
          correta: true,
          explicacao: 'Certinho! Vênus é o cupido da astrologia e ensina como você gosta de ser amado e acolhido.',
        },
        {
          texto: 'A calculadora de juros do banco',
          correta: false,
          explicacao: 'O banco só cuida de boletos! Quem cuida do seu coração apaixonado é Vênus.',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Vênus só cuida de relacionamentos amorosos?',
        resposta: 'Também fala sobre amizades, dinheiro, beleza e as coisas que você valoriza.',
      },
    ],
    termosRelacionados: ['marte-no-mapa', 'sinastria-amorosa', 'signo-solar'],
    ferramentaRelacionada: {
      nome: 'Descobrir Meu Signo',
      rota: 'discover-sign',
    },
  },
  {
    id: 'marte-no-mapa',
    slug: 'what-does-mars-mean',
    termo: 'Marte (O Planeta da Ação)',
    perguntaGoogle: 'O que significa Marte na Astrologia?',
    tituloSEO: 'O que Marte Representa na Astrologia? Sua Coragem e Força de Ação',
    categoria: 'Planetas & Astros',
    icone: '🔥',
    resumoUmaLinha: 'A sua força de vontade, coragem e capacidade de começar coisas novas.',
    explicacaoEducativa: 'Saiba por que Marte é o planeta da ação e como ele te dá coragem e força de vontade para começar coisas novas.',
    chamadaCuriosa: 'Saiba por que Marte é o acelerador que te dá coragem para agir',
    oQueSignifica:
      'É o famoso planeta vermelho vizinho da Terra no nosso sistema solar.',
    oQueSignificaNaAstrologia:
      'Marte é o seu acelerador! Ele mostra como você luta pelo que quer, a sua coragem, como reage sob pressão e a sua energia física.',
    exemploFicticio:
      'Quando toca o alarme para fazer exercícios físicos e você pula da cama com disposição, é a energia de Marte falando alto.',
    dicaRapida: 'Marte é a faísca que transforma planos em ação de verdade.',
    miniJogo: {
      pergunta: 'Quando você precisa de coragem para dizer "chega" ou começar um projeto novo, qual energia você ativa?',
      opcoes: [
        {
          texto: 'A força de Marte (o acelerador que coloca seus planos em movimento)',
          correta: true,
          explicacao: 'Exato! Marte é a faísca de coragem que tira qualquer sonho do papel e faz acontecer.',
        },
        {
          texto: 'O modo soneca do despertador',
          correta: false,
          explicacao: 'O modo soneca quer descanso! Marte quer atitude e vitória!',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Marte significa agressividade?',
        resposta: 'Não obrigatoriamente. Quando equilibrado, ele representa iniciativa e coragem saudável.',
      },
    ],
    termosRelacionados: ['venus-no-mapa', 'signo-solar', 'elementos-astrologicos'],
    ferramentaRelacionada: {
      nome: 'Calcular Efeito Auren',
      rota: 'aureneffect',
    },
  },
  {
    id: 'elementos-astrologicos',
    slug: 'what-are-astrology-elements',
    termo: 'Os 4 Elementos (Fogo, Terra, Ar e Água)',
    perguntaGoogle: 'O que são os 4 elementos da Astrologia?',
    tituloSEO: 'Os 4 Elementos na Astrologia: Fogo, Terra, Ar e Água Explicados',
    categoria: 'Signos & Elementos',
    icone: '🌿',
    resumoUmaLinha: 'As 4 energias da natureza que dividem os 12 signos do zodíaco.',
    explicacaoEducativa: 'Saiba por que os 4 elementos (Fogo, Terra, Ar e Água) definem o seu temperamento e como equilibrar cada um na rotina.',
    chamadaCuriosa: 'Saiba qual dos 4 elementos comanda o seu jeito de ser',
    oQueSignifica:
      'São as quatro forças básicas que compõem a Terra e que dividem os 12 signos em 4 grupos de 3 signos cada.',
    oQueSignificaNaAstrologia:
      'Fogo traz entusiasmo e ação. Terra traz pés no chão e segurança. Ar traz ideias e comunicação. Água traz sentimentos e carinho.',
    exemploFicticio:
      'Num projeto em grupo: o de Fogo dá a ideia empolgada, o de Terra faz a planilha de custos, o de Ar escreve a apresentação e o de Água cuida do clima da equipe.',
    dicaRapida: 'Ter um pouco de cada elemento na vida é a receita para o equilíbrio.',
    miniJogo: {
      pergunta: 'Qual elemento na astrologia é conhecido por ser o mais pé no chão, organizado e prático?',
      opcoes: [
        {
          texto: 'Terra (Touro, Virgem e Capricórnio)',
          correta: true,
          explicacao: 'Perfeito! O elemento Terra adora segurança, organização, pés no chão e resultados reais.',
        },
        {
          texto: 'Ar (Gêmeos, Libra e Aquário)',
          correta: false,
          explicacao: 'O elemento Ar adora ideias voando livres e boas conversas, mas a Terra é quem organiza tudo!',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Quais são os signos de cada elemento?',
        resposta: 'Fogo (Áries, Leão, Sagitário), Terra (Touro, Virgem, Capricórnio), Ar (Gêmeos, Libra, Aquário) e Água (Câncer, Escorpião, Peixes).',
      },
    ],
    termosRelacionados: ['signo-solar', 'signo-ascendente', 'cuspide'],
    ferramentaRelacionada: {
      nome: 'Descobrir Meu Signo',
      rota: 'discover-sign',
    },
  },
  {
    id: 'sinastria-amorosa',
    slug: 'what-is-synastry',
    termo: 'Sinastria (Compatibilidade entre Signos)',
    perguntaGoogle: 'O que é Sinastria Amorosa?',
    tituloSEO: 'O que é Sinastria? Como os Signos Combinam no Amor e na Amizade',
    categoria: 'Conceitos do Mapa',
    icone: '💞',
    resumoUmaLinha: 'A comparação de dois mapas astrais para entender a sintonia de um casal.',
    explicacaoEducativa: 'Saiba por que certas pessoas combinam tão fácil e como a sinastria explica a sintonia e a química de um casal.',
    chamadaCuriosa: 'Saiba se o seu signo combina mesmo com o crush ou vai dar briga',
    oQueSignifica:
      'É o estudo de colocar o mapa astral de duas pessoas lado a lado para ver como elas se conectam.',
    oQueSignificaNaAstrologia:
      'Mostra onde o casal tem química e conversa fácil, e onde precisa de um pouquinho mais de paciência e empatia.',
    exemploFicticio:
      'Paula e Thiago fizeram uma sinastria e riram ao ver que se entendem pelo olhar, mas precisam combinar com antecedência os passeios do fim de semana.',
    dicaRapida: 'Nenhum signo é incompatível quando existe respeito e amor.',
    miniJogo: {
      pergunta: 'O que a Sinastria nos ensina sobre duas pessoas que se gostam?',
      opcoes: [
        {
          texto: 'Onde o casal tem sintonia natural e onde precisa de mais conversa e carinho',
          correta: true,
          explicacao: 'Muito lindo! A sinastria é uma ferramenta de amor e empatia para viverem em harmonia.',
        },
        {
          texto: 'Quem deve pagar a conta do restaurante',
          correta: false,
          explicacao: 'A conta do restaurante é melhor combinar com carinho e bom humor na hora!',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Sinastria serve só para namoro?',
        resposta: 'Serve para namoro, casamento, amizades e até para sócios em negócios.',
      },
    ],
    termosRelacionados: ['venus-no-mapa', 'mapa-astral', 'signo-lunar'],
    ferramentaRelacionada: {
      nome: 'Ver Mensagem Diária',
      rota: 'daily-message',
    },
  },
  {
    id: 'revolucao-solar',
    slug: 'what-is-solar-return',
    termo: 'Revolução Solar (Seu Ano Novo Pessoal)',
    perguntaGoogle: 'O que é Revolução Solar?',
    tituloSEO: 'O que é Revolução Solar? O Seu Mapa Astral de Aniversário',
    categoria: 'Fases & Movimentos',
    icone: '🎂',
    resumoUmaLinha: 'O mapa astral anual calculado no dia exato do seu aniversário.',
    explicacaoEducativa: 'Saiba por que o seu aniversário é o seu Ano Novo pessoal e o que a Revolução Solar prevê para os seus próximos 12 meses.',
    chamadaCuriosa: 'Saiba por que no seu aniversário a sua sorte recomeça do zero',
    oQueSignifica:
      'Todo ano, no dia do seu aniversário, o Sol volta exatamente ao mesmo grau onde estava quando você nasceu.',
    oQueSignificaNaAstrologia:
      'É o mapa das energias do seu novo ano de vida! Mostra os temas centrais que vão marcar os próximos 12 meses da sua jornada.',
    exemploFicticio:
      'No ano em que completou 25 anos, a Revolução Solar de Vanessa indicava muito foco em estudos e ela ganhou uma bolsa de pós-graduação.',
    dicaRapida: 'O seu aniversário é o momento mais poderoso de renovação do seu ano.',
    miniJogo: {
      pergunta: 'Quando a sua energia cósmica zera e você começa um ano novinho em folha?',
      opcoes: [
        {
          texto: 'No dia do seu aniversário (o seu verdadeiro Ano Novo particular)',
          correta: true,
          explicacao: 'Parabéns! O dia do aniversário é o momento mágico de soprar as velinhas e renovar todos os desejos.',
        },
        {
          texto: 'Na quarta-feira de cinzas depois do almoço',
          correta: false,
          explicacao: 'Não! O seu ciclo particular recomeça no dia do seu nascimento.',
        },
      ],
    },
    faq: [
      {
        pergunta: 'A Revolução Solar muda o meu signo?',
        resposta: 'Não, o seu signo natal nunca muda; apenas mostra os focos e novidades daquele ano.',
      },
    ],
    termosRelacionados: ['signo-solar', 'retorno-de-saturno', 'mapa-astral'],
    ferramentaRelacionada: {
      nome: 'Calcular Efeito Auren',
      rota: 'aureneffect',
    },
  },
  {
    id: 'lua-cheia',
    slug: 'what-is-full-moon-meaning',
    termo: 'Lua Cheia',
    perguntaGoogle: 'O que a Lua Cheia significa na Astrologia?',
    tituloSEO: 'Lua Cheia na Astrologia: O Ponto Alto das Emoções e Celebração',
    categoria: 'Fases & Movimentos',
    icone: '🌕',
    resumoUmaLinha: 'A fase da colheita, das emoções vibrantes e de celebrar conquistas.',
    explicacaoEducativa: 'Saiba por que a Lua Cheia mexe tanto com as nossas emoções e por que ficamos mais sensíveis e com vontade de celebrar.',
    chamadaCuriosa: 'Saiba por que na Lua Cheia as pessoas ficam tão agitadas e sem sono',
    oQueSignifica:
      'É a fase em que a Lua fica totalmente iluminada pelo Sol, brilhando redonda e prateada no céu noturno.',
    oQueSignificaNaAstrologia:
      'Representa o ápice da energia do mês! As emoções ficam mais intensas e sentimos vontade de celebrar o que colhemos.',
    exemploFicticio:
      'Na noite de Lua Cheia, Camila percebe que fica cheia de ideias, sonha bastante e sente vontade de reunir os amigos.',
    dicaRapida: 'Na Lua Cheia, agradeça por tudo de bom que aconteceu no mês.',
    miniJogo: {
      pergunta: 'Na noite de Lua Cheia, como costumam ficar as nossas emoções e nossa energia?',
      opcoes: [
        {
          texto: 'Mais intensas, vibrantes e cheias de vontade de conversar ou festejar',
          correta: true,
          explicacao: 'Isso aí! A Lua Cheia ilumina tudo com muita intensidade e celebração.',
        },
        {
          texto: 'Totalmente desligadas feito um computador sem bateria',
          correta: false,
          explicacao: 'Pelo contrário! A Lua Cheia transborda energia e luz na nossa noite.',
        },
      ],
    },
    faq: [
      {
        pergunta: 'A Lua Cheia atrapalha o sono?',
        resposta: 'Como há mais luz natural e energia no ar, muitas pessoas sentem a mente mais ativa.',
      },
    ],
    termosRelacionados: ['lua-nova', 'signo-lunar', 'eclipse-astrologico'],
    ferramentaRelacionada: {
      nome: 'Ver Lua de Hoje',
      rota: 'daily-message',
    },
  },
  {
    id: 'lua-nova',
    slug: 'what-is-new-moon-meaning',
    termo: 'Lua Nova',
    perguntaGoogle: 'O que a Lua Nova significa na Astrologia?',
    tituloSEO: 'Lua Nova na Astrologia: O Melhor Momento para Começar Sonhos',
    categoria: 'Fases & Movimentos',
    icone: '🌑',
    resumoUmaLinha: 'O início de um ciclo: a hora certa de plantar novos planos.',
    explicacaoEducativa: 'Saiba por que a Lua Nova é a fase perfeita para plantar novas metas e recomeçar sonhos do zero com calma.',
    chamadaCuriosa: 'Saiba por que a Lua Nova é a melhor noite do mês para recomeçar planos',
    oQueSignifica:
      'É quando a Lua está alinhada entre a Terra e o Sol, ficando invisível no céu noturno.',
    oQueSignificaNaAstrologia:
      'É a fase de plantar sementes e recomeçar. É o momento perfeito para escrever metas e iniciar projetos.',
    exemploFicticio:
      'Na primeira noite de Lua Nova, Bruno escreve no caderno suas metas profissionais para os próximos 30 dias com muita calma.',
    dicaRapida: 'A Lua Nova é o melhor dia para dar o primeiro passo.',
    miniJogo: {
      pergunta: 'Quando o céu está escuro na noite de Lua Nova, qual é a atitude mais bonita para você tomar?',
      opcoes: [
        {
          texto: 'Escrever novos desejos no caderno e plantar boas ideias para o mês',
          correta: true,
          explicacao: 'Excelente! A Lua Nova é como um terreno fértil esperando pelas suas melhores sementes.',
        },
        {
          texto: 'Desistir de tudo e achar que o mês está perdido',
          correta: false,
          explicacao: 'De jeito nenhum! É tempo de recomeço, esperança e novas chances.',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Quantos dias dura o ciclo da Lua?',
        resposta: 'Dura cerca de 29,5 dias, passando por Nova, Crescente, Cheia e Minguante.',
      },
    ],
    termosRelacionados: ['lua-cheia', 'signo-lunar', 'eclipse-astrologico'],
    ferramentaRelacionada: {
      nome: 'Mensagem Diária',
      rota: 'daily-message',
    },
  },
  {
    id: 'eclipse-astrologico',
    slug: 'what-is-eclipse-meaning',
    termo: 'Eclipse',
    perguntaGoogle: 'O que significa um Eclipse na Astrologia?',
    tituloSEO: 'O que Significa Eclipse na Astrologia? Mudanças e Novos Caminhos',
    categoria: 'Fases & Movimentos',
    icone: '🌘',
    resumoUmaLinha: 'A aceleração de mudanças importantes e o encerramento de velhos ciclos.',
    explicacaoEducativa: 'Saiba por que os eclipses trazem mudanças tão rápidas e funcionam como aceleradores da vida para virar a página.',
    chamadaCuriosa: 'Saiba por que os eclipses trazem reviravoltas que mudam seu destino',
    oQueSignifica:
      'É quando a Terra ou a Lua passa na frente da luz do Sol, projetando uma sombra temporária.',
    oQueSignificaNaAstrologia:
      'Os eclipses funcionam como um botão de acelerador da vida, trazendo viradas de página necessárias.',
    exemploFicticio:
      'Na semana do eclipse, Mariana tomou coragem para se mudar para uma casa perto da praia, algo que sonhava há anos.',
    dicaRapida: 'Em dias de eclipse, descanse e evite discussões acaloradas.',
    miniJogo: {
      pergunta: 'Quando um eclipse acontece no céu, o que ele costuma acelerar na nossa vida?',
      opcoes: [
        {
          texto: 'Mudanças necessárias para abrir espaço para histórias melhores',
          correta: true,
          explicacao: 'Muito bem! O eclipse dá um empurrãozinho carinhoso para a gente virar a página com coragem.',
        },
        {
          texto: 'A velocidade com que a água do miojo ferve',
          correta: false,
          explicacao: 'O fogão continua igualzinho! O eclipse mexe é com os nossos caminhos de vida.',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Quantos eclipses acontecem por ano?',
        resposta: 'Geralmente acontecem de 4 a 6 eclipses (solares e lunares) a cada ano.',
      },
    ],
    termosRelacionados: ['lua-cheia', 'lua-nova', 'retorno-de-saturno'],
    ferramentaRelacionada: {
      nome: 'Ver Efeito Auren',
      rota: 'aureneffect',
    },
  },
  {
    id: 'cuspide',
    slug: 'what-is-cusp-astrology',
    termo: 'Cúspide (Transição de Signos)',
    perguntaGoogle: 'O que é nascer na Cúspide?',
    tituloSEO: 'O que é Cúspide na Astrologia? Nascer no Dia da Troca de Signos',
    categoria: 'Signos & Elementos',
    icone: '🔄',
    resumoUmaLinha: 'Nascer bem no dia em que o Sol muda de um signo para o outro.',
    explicacaoEducativa: 'Saiba por que nascer no dia da virada de signo te dá um charme especial e como você herda a energia do vizinho.',
    chamadaCuriosa: 'Saiba por que quem nasce na troca de signo sente que tem dois lados',
    oQueSignifica:
      'É a fronteira invisível que divide um signo do signo vizinho no céu.',
    oQueSignificaNaAstrologia:
      'Quem nasce no primeiro ou último dia de um signo sente um pouco da influência do signo vizinho.',
    exemploFicticio:
      'Renato nasceu na virada de Touro para Gêmeos: ama cozinhar em paz em casa (Touro), mas adora passar horas proseando no WhatsApp (Gêmeos).',
    dicaRapida: 'Você tem um signo solar oficial, mas pode carregar o charme do vizinho.',
    miniJogo: {
      pergunta: 'Quem nasce bem no dia em que o signo está mudando ganha o quê de especial?',
      opcoes: [
        {
          texto: 'O charme e o tempero especial do signo vizinho',
          correta: true,
          explicacao: 'Na mosca! Você tem o seu signo oficial e ainda ganha uma pitada mágica do vizinho.',
        },
        {
          texto: 'Fica sem signo nenhum para sempre',
          correta: false,
          explicacao: 'Todo mundo tem seu signo solar único e oficial no mapa!',
        },
      ],
    },
    faq: [
      {
        pergunta: 'Uma pessoa pode ter dois signos solares?',
        resposta: 'Não, dependendo do minuto exato do nascimento o Sol já estava em um signo específico.',
      },
    ],
    termosRelacionados: ['signo-solar', 'elementos-astrologicos', 'signo-ascendente'],
    ferramentaRelacionada: {
      nome: 'Descobrir Meu Signo',
      rota: 'discover-sign',
    },
  },
];

export const getDictionaryTermBySlug = (slug: string): DictionaryTerm | undefined => {
  const cleanSlug = slug.toLowerCase().trim();
  return ASTROLOGY_DICTIONARY_TERMS.find(
    (t) =>
      t.slug.toLowerCase() === cleanSlug ||
      t.id.toLowerCase() === cleanSlug ||
      cleanSlug.includes(t.slug.toLowerCase()) ||
      t.slug.toLowerCase().includes(cleanSlug)
  );
};
