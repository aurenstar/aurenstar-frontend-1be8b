// Portuguese and Spanish versions of the visible text of every dictionary term.
// English stays in astrologyDictionaryData.ts (it is the default and the SEO language).
import type { DictionaryTerm } from './astrologyDictionaryData';

export type TermLang = 'pt' | 'es';

export interface TermTexts {
  termo: string;
  perguntaGoogle: string;
  resumoUmaLinha: string;
  chamadaCuriosa: string;
  oQueSignifica: string;
  oQueSignificaNaAstrologia: string;
  exemploFicticio: string;
  faq?: { pergunta: string; resposta: string }[];
}

export const CATEGORY_LABELS: Record<TermLang, Record<DictionaryTerm['categoria'], string>> = {
  pt: { 'Planets & Bodies': 'Planetas e Astros', 'Chart Concepts': 'Conceitos do Mapa', 'Signs & Elements': 'Signos e Elementos', 'Phases & Movements': 'Fases e Movimentos' },
  es: { 'Planets & Bodies': 'Planetas y Astros', 'Chart Concepts': 'Conceptos de la Carta', 'Signs & Elements': 'Signos y Elementos', 'Phases & Movements': 'Fases y Movimientos' },
};

export const TOOL_LABELS: Record<TermLang, Record<string, string>> = {
  pt: {
    "Read Today's Daily Message": 'Ler a mensagem de hoje',
    'Read the Daily Message': 'Ler a mensagem do dia',
    'Daily Message': 'Mensagem do dia',
    'Calculate in Aureneffect': 'Calcular no Aureneffect',
    'Calculate Your Moon in Aureneffect': 'Calcular sua Lua no Aureneffect',
    'Try Aureneffect': 'Experimentar o Aureneffect',
    'Find My Sign': 'Descobrir meu signo',
    "See Today's Moon": 'Ver a Lua de hoje',
  },
  es: {
    "Read Today's Daily Message": 'Leer el mensaje de hoy',
    'Read the Daily Message': 'Leer el mensaje del día',
    'Daily Message': 'Mensaje del día',
    'Calculate in Aureneffect': 'Calcular en Aureneffect',
    'Calculate Your Moon in Aureneffect': 'Calcular tu Luna en Aureneffect',
    'Try Aureneffect': 'Probar Aureneffect',
    'Find My Sign': 'Descubrir mi signo',
    "See Today's Moon": 'Ver la Luna de hoy',
  },
};

export const TERM_TRANSLATIONS: Record<TermLang, Record<string, TermTexts>> = {
  pt: {
    'what-is-mercury-retrograde': {
      termo: 'Mercúrio Retrógrado',
      perguntaGoogle: 'O que é Mercúrio retrógrado?',
      resumoUmaLinha: 'Quando o planeta da comunicação parece andar para trás no céu.',
      chamadaCuriosa: 'Entenda por que Mercúrio retrógrado dá tanto medo',
      oQueSignifica: 'É quando o planeta Mercúrio parece andar para trás no céu. Na verdade, ele nunca anda para trás: é só uma ilusão de ótica vista aqui da Terra, como quando você está num carro rápido e o carro da outra faixa parece andar de ré.',
      oQueSignificaNaAstrologia: 'Na astrologia, Mercúrio cuida das conversas, das mensagens, das viagens e dos aparelhos eletrônicos. Quando ele está retrógrado, esse período é ligado a pequenos mal-entendidos, mensagens lidas errado, atrasos e à necessidade de rever com calma o que já foi feito.',
      exemploFicticio: 'Imagine que a Maria combina de encontrar uma amiga no shopping, mas cada uma entende um horário e elas se desencontram. A Maria brinca: "Claro, Mercúrio retrógrado atrapalhando meus planos de novo!"',
    },
    'what-is-rising-sign': {
      termo: 'Ascendente',
      perguntaGoogle: 'O que é o signo ascendente?',
      resumoUmaLinha: 'O signo que estava nascendo no horizonte quando você nasceu: a sua porta de entrada.',
      chamadaCuriosa: 'Entenda por que o Ascendente é a primeira coisa que as pessoas notam em você',
      oQueSignifica: 'É o signo que estava nascendo no horizonte leste no minuto exato em que você nasceu. Por isso você precisa da sua hora de nascimento para descobrir o ascendente com precisão.',
      oQueSignificaNaAstrologia: 'O ascendente é como a sua "porta de entrada", a primeira impressão que você passa para o mundo. É o jeito como você fala, começa coisas novas e como as pessoas te veem antes de te conhecerem de verdade.',
      exemploFicticio: 'O Lucas é de Peixes (muito sensível e calmo por dentro), mas tem Ascendente em Áries. Quando entra numa reunião, ele fala alto, assume o comando e parece mandão. As pessoas se surpreendem quando descobrem como ele é doce de verdade.',
    },
    'what-is-sun-sign': {
      termo: 'Signo Solar (Seu Signo Principal)',
      perguntaGoogle: 'O que é o signo solar?',
      resumoUmaLinha: 'Onde o Sol estava quando você nasceu: a bateria da sua energia.',
      chamadaCuriosa: 'Entenda por que o seu signo solar não conta a história toda sobre você',
      oQueSignifica: 'É a posição do Sol no céu no dia do seu aniversário. É o signo que todo mundo diz quando pergunta: "Qual é o seu signo?"',
      oQueSignificaNaAstrologia: 'Ele representa o seu coração, a sua essência, a sua energia e o que faz você querer acordar feliz todos os dias.',
      exemploFicticio: 'Quando a Júlia diz que é de Leão, ela está falando do signo solar: ela ama comemorar aniversários e espalha bom humor e alegria por onde passa.',
    },
    'what-is-moon-sign': {
      termo: 'Signo da Lua',
      perguntaGoogle: 'O que é o signo da Lua?',
      resumoUmaLinha: 'O signo das suas emoções mais profundas e do que te traz conforto.',
      chamadaCuriosa: 'Entenda por que a Lua manda no seu humor e nas suas lágrimas',
      oQueSignifica: 'É o signo onde a Lua estava no exato momento em que você deu o seu primeiro respiro no mundo.',
      oQueSignificaNaAstrologia: 'Enquanto o Sol cuida do que você faz durante o dia para todos verem, a Lua cuida do que você sente por dentro: as emoções privadas, os medos e o jeito como você gosta de ser acolhido.',
      exemploFicticio: 'O Pedro é de Capricórnio (muito focado e sério no trabalho), mas tem a Lua em Câncer. Em casa, ele assiste a desenhos comendo pipoca e se emociona fácil com histórias de família.',
    },
    'what-is-birth-chart': {
      termo: 'Mapa Astral (Mapa Natal)',
      perguntaGoogle: 'O que é o mapa astral?',
      resumoUmaLinha: 'Uma fotografia do céu tirada no segundo exato em que você nasceu.',
      chamadaCuriosa: 'Entenda por que o seu Mapa Astral é como a sua impressão digital no céu',
      oQueSignifica: 'É uma foto panorâmica do céu no momento exato e na cidade onde você nasceu, mostrando onde estava cada planeta e cada constelação.',
      oQueSignificaNaAstrologia: 'É o seu manual pessoal. Ele mostra os seus talentos naturais, onde você encontra sucesso com mais facilidade e quais áreas precisam de mais cuidado.',
      exemploFicticio: 'A Carla fez o mapa astral e entendeu por que ama tanto ensinar, mas precisa de momentos de silêncio todos os dias para recarregar as energias.',
    },
    'what-is-saturn-return': {
      termo: 'Retorno de Saturno',
      perguntaGoogle: 'O que é o retorno de Saturno?',
      resumoUmaLinha: 'A "formatura" para a vida adulta que acontece por volta dos 28 a 30 anos.',
      chamadaCuriosa: 'Entenda por que fazer 29 anos pode virar a sua vida de cabeça para baixo',
      oQueSignifica: 'O planeta Saturno leva quase 30 anos para dar uma volta completa em torno do Sol. Quando ele volta ao mesmo lugar em que estava quando você nasceu, temos o Retorno de Saturno.',
      oQueSignificaNaAstrologia: 'É o momento em que a vida pergunta: "Você está feliz com o caminho que escolheu?" É uma fase em que assumimos responsabilidades de verdade, mudamos de carreira ou deixamos para trás o que não faz mais sentido.',
      exemploFicticio: 'Aos 29 anos, o Rodrigo largou um emprego que não aguentava mais e finalmente abriu a sua padaria artesanal, assumindo o comando do próprio sonho.',
    },
    'what-are-astrological-houses': {
      termo: 'Casas Astrológicas',
      perguntaGoogle: 'Quais são as 12 casas astrológicas?',
      resumoUmaLinha: 'As 12 partes do mapa, cada uma representando um assunto da sua vida.',
      chamadaCuriosa: 'Entenda como a astrologia divide a sua vida em 12 áreas secretas',
      oQueSignifica: 'Imagine que o mapa astral é uma pizza redonda cortada em 12 pedaços iguais. Cada pedaço do céu se chama "casa".',
      oQueSignificaNaAstrologia: 'Cada casa cuida de um tema: a Casa 1 fala de você, a 2 de dinheiro, a 4 da sua casa e da família, a 7 de amor e parcerias, e a 10 da carreira.',
      exemploFicticio: 'Se você tem vários planetas reunidos na Casa 4, o seu lar é o lugar mais sagrado da sua vida e você adora receber as pessoas queridas.',
    },
    'what-does-venus-mean': {
      termo: 'Vênus (O Planeta do Amor)',
      perguntaGoogle: 'O que significa Vênus na astrologia?',
      resumoUmaLinha: 'O planeta do amor, da beleza, dos prazeres e do jeito como você se relaciona.',
      chamadaCuriosa: 'Entenda por que Vênus define quem você ama e quem te atrai',
      oQueSignifica: 'É o planeta brilhante que vemos no início da noite ou ao amanhecer, conhecido popularmente como Estrela da Manhã ou Estrela da Tarde.',
      oQueSignificaNaAstrologia: 'Vênus mostra o seu jeito de amar, o que você acha bonito, o que te dá prazer e como você gosta de ser tratado pelas pessoas que ama.',
      exemploFicticio: 'A Beatriz tem Vênus em Touro. Para ela, carinho de verdade é um jantar feito com capricho em casa, com uma sobremesa deliciosa.',
    },
    'what-does-mars-mean': {
      termo: 'Marte (O Planeta da Ação)',
      perguntaGoogle: 'O que significa Marte na astrologia?',
      resumoUmaLinha: 'A sua força de vontade, a sua coragem e a sua capacidade de começar coisas novas.',
      chamadaCuriosa: 'Entenda por que Marte é o acelerador que te dá coragem para agir',
      oQueSignifica: 'É o famoso planeta vermelho, nosso vizinho no sistema solar.',
      oQueSignificaNaAstrologia: 'Marte é o seu acelerador! Ele mostra como você luta pelo que quer, a sua coragem, como você reage sob pressão e a sua energia física.',
      exemploFicticio: 'Quando o despertador toca para o treino e você pula da cama cheio de energia, é a energia de Marte falando alto.',
    },
    'what-are-astrology-elements': {
      termo: 'Os 4 Elementos (Fogo, Terra, Ar e Água)',
      perguntaGoogle: 'Quais são os 4 elementos da astrologia?',
      resumoUmaLinha: 'As 4 energias da natureza que dividem os 12 signos do zodíaco.',
      chamadaCuriosa: 'Descubra qual dos 4 elementos manda no seu jeito de ser',
      oQueSignifica: 'São as quatro forças básicas que formam a Terra e que dividem os 12 signos em 4 grupos de 3 signos cada.',
      oQueSignificaNaAstrologia: 'O Fogo traz entusiasmo e ação. A Terra traz firmeza e segurança. O Ar traz ideias e comunicação. A Água traz sentimentos e afeto.',
      exemploFicticio: 'Em um trabalho em grupo: a pessoa de Fogo tem a ideia empolgante, a de Terra monta a planilha de custos, a de Ar escreve a apresentação e a de Água cuida do clima do time.',
    },
    'what-is-synastry': {
      termo: 'Sinastria (Compatibilidade de Signos)',
      perguntaGoogle: 'O que é sinastria na astrologia?',
      resumoUmaLinha: 'Comparar dois mapas astrais para entender a conexão de um casal.',
      chamadaCuriosa: 'Descubra se o seu signo combina mesmo com o seu crush ou se vem briga por aí',
      oQueSignifica: 'É o estudo de colocar os mapas astrais de duas pessoas lado a lado para ver como eles se conectam.',
      oQueSignificaNaAstrologia: 'Ela mostra onde o casal tem química e conversa fácil, e onde precisa de um pouco mais de paciência e empatia.',
      exemploFicticio: 'A Paula e o Tiago fizeram a sinastria e riram ao ver que se entendem só com o olhar, mas precisam combinar os passeios de fim de semana com antecedência.',
    },
    'what-is-solar-return': {
      termo: 'Revolução Solar (Seu Ano Novo Pessoal)',
      perguntaGoogle: 'O que é a revolução solar?',
      resumoUmaLinha: 'O mapa do ano, calculado no dia exato do seu aniversário.',
      chamadaCuriosa: 'Entenda por que a sua sorte recomeça do zero no seu aniversário',
      oQueSignifica: 'Todo ano, no seu aniversário, o Sol volta exatamente ao mesmo grau em que estava quando você nasceu.',
      oQueSignificaNaAstrologia: 'É o mapa das energias do seu novo ano de vida! Ele mostra os temas centrais que vão marcar os próximos 12 meses da sua jornada.',
      exemploFicticio: 'No ano em que fez 25 anos, a Revolução Solar da Vanessa apontou um foco forte nos estudos, e ela ganhou uma bolsa de pós-graduação.',
    },
    'what-is-full-moon-meaning': {
      termo: 'Lua Cheia',
      perguntaGoogle: 'O que significa a Lua Cheia na astrologia?',
      resumoUmaLinha: 'A fase da colheita, das emoções vibrantes e de comemorar as conquistas.',
      chamadaCuriosa: 'Entenda por que as pessoas ficam tão agitadas e sem sono na Lua Cheia',
      oQueSignifica: 'É a fase em que a Lua está totalmente iluminada pelo Sol, brilhando redonda e prateada no céu da noite.',
      oQueSignificaNaAstrologia: 'Ela representa o auge da energia do mês! As emoções ficam mais intensas e dá vontade de comemorar o que colhemos.',
      exemploFicticio: 'Em uma noite de Lua Cheia, a Camila percebe que está cheia de ideias, sonha muito e sente vontade de reunir os amigos.',
    },
    'what-is-new-moon-meaning': {
      termo: 'Lua Nova',
      perguntaGoogle: 'O que significa a Lua Nova na astrologia?',
      resumoUmaLinha: 'O começo de um ciclo: a hora certa de plantar novos planos.',
      chamadaCuriosa: 'Entenda por que a Lua Nova é a melhor noite do mês para recomeçar os seus planos',
      oQueSignifica: 'É quando a Lua fica alinhada entre a Terra e o Sol, ficando invisível no céu da noite.',
      oQueSignificaNaAstrologia: 'É a fase de plantar sementes e recomeçar. É o momento perfeito para anotar metas e começar projetos.',
      exemploFicticio: 'Na primeira noite de Lua Nova, o Bruno anota com calma, no caderno, as suas metas profissionais para os próximos 30 dias.',
    },
    'what-is-eclipse-meaning': {
      termo: 'Eclipse',
      perguntaGoogle: 'O que significa um eclipse na astrologia?',
      resumoUmaLinha: 'A aceleração de mudanças importantes e o fechamento de ciclos antigos.',
      chamadaCuriosa: 'Entenda por que os eclipses trazem reviravoltas que mudam o seu destino',
      oQueSignifica: 'É quando a Terra ou a Lua passa na frente da luz do Sol, criando uma sombra temporária.',
      oQueSignificaNaAstrologia: 'Os eclipses funcionam como um botão de acelerar a vida, trazendo viradas de página necessárias.',
      exemploFicticio: 'Na semana do eclipse, a Mariana finalmente teve coragem de se mudar para uma casa perto da praia, algo que sonhava há anos.',
    },
    'what-is-cusp-astrology': {
      termo: 'Cúspide (Transição de Signo)',
      perguntaGoogle: 'O que significa nascer na cúspide?',
      resumoUmaLinha: 'Nascer bem no dia em que o Sol passa de um signo para o próximo.',
      chamadaCuriosa: 'Entenda por que quem nasce na virada de signo sente que tem dois lados',
      oQueSignifica: 'É a fronteira invisível que separa um signo do signo vizinho no céu.',
      oQueSignificaNaAstrologia: 'Quem nasce no primeiro ou no último dia de um signo sente um pouco da influência do signo vizinho.',
      exemploFicticio: 'O Rafael nasceu na virada de Touro para Gêmeos: ele adora cozinhar em paz em casa (Touro), mas também adora passar horas batendo papo por mensagem (Gêmeos).',
    },
  },
  es: {
    'what-is-mercury-retrograde': {
      termo: 'Mercurio Retrógrado',
      perguntaGoogle: '¿Qué es Mercurio retrógrado?',
      resumoUmaLinha: 'Cuando el planeta de la comunicación parece ir hacia atrás en el cielo.',
      chamadaCuriosa: 'Descubre por qué Mercurio retrógrado da tanto miedo',
      oQueSignifica: 'Es cuando el planeta Mercurio parece moverse hacia atrás en el cielo. En realidad nunca retrocede: es solo una ilusión óptica desde la Tierra, como cuando vas en un coche rápido y el de al lado parece ir en reversa.',
      oQueSignificaNaAstrologia: 'En astrología, Mercurio gobierna las conversaciones, los mensajes, los viajes y los aparatos electrónicos. Cuando está retrógrado, ese periodo se asocia con pequeños malentendidos, mensajes mal leídos, retrasos y la necesidad de revisar con calma lo que ya hicimos.',
      exemploFicticio: 'Imagina que María queda con una amiga en el centro comercial, pero cada una entiende una hora distinta y no se encuentran. María bromea: "¡Claro, Mercurio retrógrado arruinando mis planes otra vez!"',
    },
    'what-is-rising-sign': {
      termo: 'Signo Ascendente',
      perguntaGoogle: '¿Qué es el signo ascendente?',
      resumoUmaLinha: 'El signo que estaba saliendo por el horizonte cuando naciste: tu puerta de entrada.',
      chamadaCuriosa: 'Descubre por qué el Ascendente es lo primero que la gente nota de ti',
      oQueSignifica: 'Es el signo que estaba saliendo por el horizonte este en el minuto exacto en que naciste. Por eso necesitas tu hora de nacimiento para encontrar tu ascendente con precisión.',
      oQueSignificaNaAstrologia: 'El ascendente es como tu "puerta de entrada", la primera impresión que das al mundo. Es cómo hablas, cómo empiezas cosas nuevas y cómo te ve la gente antes de conocerte de verdad.',
      exemploFicticio: 'Lucas es Piscis (muy sensible y tranquilo por dentro), pero tiene Ascendente en Aries. Cuando entra a una reunión, habla fuerte, toma el mando y parece mandón. La gente se sorprende al descubrir lo dulce que es en realidad.',
    },
    'what-is-sun-sign': {
      termo: 'Signo Solar (Tu Signo Principal)',
      perguntaGoogle: '¿Qué es el signo solar?',
      resumoUmaLinha: 'Dónde estaba el Sol cuando naciste: la batería de tu energía.',
      chamadaCuriosa: 'Descubre por qué tu signo solar no cuenta toda la historia sobre ti',
      oQueSignifica: 'Es la posición del Sol en el cielo el día de tu cumpleaños. Es el signo que todos dicen cuando preguntan: "¿Cuál es tu signo?"',
      oQueSignificaNaAstrologia: 'Representa tu corazón, tu esencia básica, tu energía y lo que te hace querer despertar feliz cada día.',
      exemploFicticio: 'Cuando Julia dice que es Leo, habla de su Signo Solar: le encanta celebrar cumpleaños y reparte buen humor y alegría por donde pasa.',
    },
    'what-is-moon-sign': {
      termo: 'Signo de la Luna',
      perguntaGoogle: '¿Qué es el signo de la Luna?',
      resumoUmaLinha: 'El signo de tus emociones más profundas y de lo que te da consuelo.',
      chamadaCuriosa: 'Descubre por qué la Luna manda en tu humor y en tus lágrimas',
      oQueSignifica: 'Es el signo donde estaba la Luna en el momento exacto en que diste tu primer aliento en el mundo.',
      oQueSignificaNaAstrologia: 'Mientras el Sol se ocupa de lo que haces de día para que todos lo vean, la Luna se ocupa de lo que sientes por dentro: tus emociones privadas, tus miedos y cómo te gusta que te consuelen.',
      exemploFicticio: 'Pedro es Capricornio (muy enfocado y serio en el trabajo), pero tiene la Luna en Cáncer. En casa ve dibujos animados mientras come palomitas y se emociona fácilmente con historias de familia.',
    },
    'what-is-birth-chart': {
      termo: 'Carta Natal',
      perguntaGoogle: '¿Qué es la carta natal?',
      resumoUmaLinha: 'Una fotografía del cielo tomada en el segundo exacto en que naciste.',
      chamadaCuriosa: 'Descubre por qué tu Carta Natal es como tu huella digital en el cielo',
      oQueSignifica: 'Es una foto panorámica del cielo en el momento exacto y en la ciudad donde naciste, que muestra dónde estaba cada planeta y cada constelación.',
      oQueSignificaNaAstrologia: 'Es tu manual personal. Muestra tus talentos naturales, dónde encuentras el éxito con más facilidad y qué áreas necesitas cuidar con más atención.',
      exemploFicticio: 'Carla se hizo la carta natal y entendió por qué le encanta tanto enseñar, pero necesita momentos de silencio cada día para recargar energías.',
    },
    'what-is-saturn-return': {
      termo: 'Retorno de Saturno',
      perguntaGoogle: '¿Qué es el retorno de Saturno?',
      resumoUmaLinha: 'La "graduación" a la vida adulta que ocurre alrededor de los 28 a 30 años.',
      chamadaCuriosa: 'Descubre por qué cumplir 29 puede poner tu vida de cabeza',
      oQueSignifica: 'El planeta Saturno tarda casi 30 años en dar una vuelta completa al Sol. Cuando vuelve al mismo lugar donde estaba cuando naciste, tenemos el Retorno de Saturno.',
      oQueSignificaNaAstrologia: 'Es el momento en que la vida te pregunta: "¿Eres feliz con el camino que elegiste?" Es una etapa en la que asumimos responsabilidades reales, cambiamos de carrera o dejamos atrás lo que ya no tiene sentido.',
      exemploFicticio: 'A los 29 años, Rodrigo dejó un trabajo que ya no soportaba y por fin abrió su panadería artesanal, tomando las riendas de su propio sueño.',
    },
    'what-are-astrological-houses': {
      termo: 'Casas Astrológicas',
      perguntaGoogle: '¿Cuáles son las 12 casas astrológicas?',
      resumoUmaLinha: 'Las 12 secciones de la carta, cada una representa un tema de tu vida.',
      chamadaCuriosa: 'Descubre cómo la astrología divide tu vida en 12 áreas secretas',
      oQueSignifica: 'Imagina que la carta natal es una pizza redonda cortada en 12 porciones iguales. Cada porción del cielo se llama "casa".',
      oQueSignificaNaAstrologia: 'Cada casa cuida de un tema: la Casa 1 habla de ti, la 2 del dinero, la 4 de tu hogar y tu familia, la 7 del amor y las parejas, y la 10 de tu carrera.',
      exemploFicticio: 'Si tienes varios planetas reunidos en la Casa 4, tu hogar es el lugar más sagrado de tu vida y te encanta tener en casa a la gente que quieres.',
    },
    'what-does-venus-mean': {
      termo: 'Venus (El Planeta del Amor)',
      perguntaGoogle: '¿Qué significa Venus en astrología?',
      resumoUmaLinha: 'El planeta del amor, la belleza, los placeres y cómo te relacionas con los demás.',
      chamadaCuriosa: 'Descubre por qué Venus define a quién amas y quién te atrae',
      oQueSignifica: 'Es el planeta brillante que vemos al comienzo de la noche o al amanecer, conocido popularmente como Lucero de la Mañana o Lucero de la Tarde.',
      oQueSignificaNaAstrologia: 'Venus muestra tu forma de amar, lo que te parece bello, lo que te da placer y cómo te gusta que te traten las personas que quieres.',
      exemploFicticio: 'Beatriz tiene Venus en Tauro. Para ella, el cariño de verdad es una cena preparada con esmero en casa, con un postre delicioso.',
    },
    'what-does-mars-mean': {
      termo: 'Marte (El Planeta de la Acción)',
      perguntaGoogle: '¿Qué significa Marte en astrología?',
      resumoUmaLinha: 'Tu fuerza de voluntad, tu valentía y tu capacidad de empezar cosas nuevas.',
      chamadaCuriosa: 'Descubre por qué Marte es el acelerador que te da valor para actuar',
      oQueSignifica: 'Es el famoso planeta rojo, nuestro vecino en el sistema solar.',
      oQueSignificaNaAstrologia: '¡Marte es tu acelerador! Muestra cómo luchas por lo que quieres, tu valentía, cómo reaccionas bajo presión y tu energía física.',
      exemploFicticio: 'Cuando suena la alarma para entrenar y saltas de la cama lleno de energía, es la energía de Marte hablando fuerte.',
    },
    'what-are-astrology-elements': {
      termo: 'Los 4 Elementos (Fuego, Tierra, Aire y Agua)',
      perguntaGoogle: '¿Cuáles son los 4 elementos en astrología?',
      resumoUmaLinha: 'Las 4 energías de la naturaleza que dividen los 12 signos del zodiaco.',
      chamadaCuriosa: 'Descubre cuál de los 4 elementos gobierna tu forma de ser',
      oQueSignifica: 'Son las cuatro fuerzas básicas que forman la Tierra y que dividen los 12 signos en 4 grupos de 3 signos cada uno.',
      oQueSignificaNaAstrologia: 'El Fuego aporta entusiasmo y acción. La Tierra aporta firmeza y seguridad. El Aire aporta ideas y comunicación. El Agua aporta sentimientos y afecto.',
      exemploFicticio: 'En un trabajo en grupo: la persona de Fuego aporta la idea emocionante, la de Tierra arma la hoja de presupuesto, la de Aire escribe la presentación y la de Agua cuida el ambiente del equipo.',
    },
    'what-is-synastry': {
      termo: 'Sinastría (Compatibilidad de Signos)',
      perguntaGoogle: '¿Qué es la sinastría en astrología?',
      resumoUmaLinha: 'Comparar dos cartas natales para entender la conexión de una pareja.',
      chamadaCuriosa: 'Descubre si tu signo combina de verdad con tu crush o si se viene una pelea',
      oQueSignifica: 'Es el estudio de poner las cartas natales de dos personas lado a lado para ver cómo se conectan.',
      oQueSignificaNaAstrologia: 'Muestra dónde la pareja tiene química y conversación fácil, y dónde necesita un poco más de paciencia y empatía.',
      exemploFicticio: 'Paula y Tiago hicieron su sinastría y se rieron al ver que se entienden con solo mirarse, pero necesitan planear con tiempo las salidas de fin de semana.',
    },
    'what-is-solar-return': {
      termo: 'Revolución Solar (Tu Año Nuevo Personal)',
      perguntaGoogle: '¿Qué es la revolución solar?',
      resumoUmaLinha: 'La carta del año, calculada el día exacto de tu cumpleaños.',
      chamadaCuriosa: 'Descubre por qué tu suerte vuelve a empezar de cero en tu cumpleaños',
      oQueSignifica: 'Cada año, en tu cumpleaños, el Sol vuelve exactamente al mismo grado donde estaba cuando naciste.',
      oQueSignificaNaAstrologia: '¡Es la carta de las energías de tu nuevo año de vida! Muestra los temas centrales que marcarán los próximos 12 meses de tu camino.',
      exemploFicticio: 'El año en que cumplió 25, la Revolución Solar de Vanessa señaló un fuerte enfoque en los estudios, y ganó una beca de posgrado.',
    },
    'what-is-full-moon-meaning': {
      termo: 'Luna Llena',
      perguntaGoogle: '¿Qué significa la luna llena en astrología?',
      resumoUmaLinha: 'La fase de la cosecha, de las emociones vibrantes y de celebrar los logros.',
      chamadaCuriosa: 'Descubre por qué la gente se pone tan inquieta y sin sueño con la Luna Llena',
      oQueSignifica: 'Es la fase en que la Luna está totalmente iluminada por el Sol, brillando redonda y plateada en el cielo de la noche.',
      oQueSignificaNaAstrologia: '¡Representa el punto máximo de la energía del mes! Las emociones se intensifican y dan ganas de celebrar lo que hemos cosechado.',
      exemploFicticio: 'En una noche de Luna Llena, Camila nota que está llena de ideas, sueña mucho y tiene ganas de reunir a sus amigos.',
    },
    'what-is-new-moon-meaning': {
      termo: 'Luna Nueva',
      perguntaGoogle: '¿Qué significa la luna nueva en astrología?',
      resumoUmaLinha: 'El comienzo de un ciclo: el momento justo para sembrar nuevos planes.',
      chamadaCuriosa: 'Descubre por qué la Luna Nueva es la mejor noche del mes para reiniciar tus planes',
      oQueSignifica: 'Es cuando la Luna queda alineada entre la Tierra y el Sol y se vuelve invisible en el cielo de la noche.',
      oQueSignificaNaAstrologia: 'Es la fase para sembrar semillas y empezar de nuevo. Es el momento perfecto para anotar metas y comenzar proyectos.',
      exemploFicticio: 'La primera noche de Luna Nueva, Bruno anota con calma en su cuaderno sus metas profesionales para los próximos 30 días.',
    },
    'what-is-eclipse-meaning': {
      termo: 'Eclipse',
      perguntaGoogle: '¿Qué significa un eclipse en astrología?',
      resumoUmaLinha: 'La aceleración de cambios importantes y el cierre de ciclos antiguos.',
      chamadaCuriosa: 'Descubre por qué los eclipses traen giros que cambian tu destino',
      oQueSignifica: 'Es cuando la Tierra o la Luna pasa frente a la luz del Sol y proyecta una sombra temporal.',
      oQueSignificaNaAstrologia: 'Los eclipses funcionan como un botón de acelerar la vida y traen cambios de página necesarios.',
      exemploFicticio: 'Durante la semana del eclipse, Mariana por fin tuvo el valor de mudarse a una casa cerca de la playa, algo con lo que soñaba desde hacía años.',
    },
    'what-is-cusp-astrology': {
      termo: 'Cúspide (Transición de Signo)',
      perguntaGoogle: '¿Qué significa nacer en la cúspide?',
      resumoUmaLinha: 'Nacer justo el día en que el Sol pasa de un signo al siguiente.',
      chamadaCuriosa: 'Descubre por qué quienes nacen en el cambio de signo sienten que tienen dos caras',
      oQueSignifica: 'Es la frontera invisible que separa un signo del signo vecino en el cielo.',
      oQueSignificaNaAstrologia: 'Las personas que nacen el primer o el último día de un signo sienten un poco de la influencia del signo vecino.',
      exemploFicticio: 'Rafael nació en el cambio de Tauro a Géminis: le encanta cocinar tranquilo en casa (Tauro), pero también pasar horas charlando por mensajes (Géminis).',
    },
  },
};

/** Returns the term with its visible texts in the chosen language (English stays untouched). */
export function localizeTerm<T extends DictionaryTerm>(term: T, lang: 'en' | 'pt' | 'es'): T {
  if (lang === 'en') return term;
  const texts = TERM_TRANSLATIONS[lang][term.slug] || (term.traducoes?.[lang] as Partial<TermTexts> | undefined);
  if (!texts) return term;
  return {
    ...term,
    ...texts,
    faq: (texts as Partial<TermTexts>).faq, // only shown in a language when it was translated too
    ferramentaRelacionada: term.ferramentaRelacionada
      ? { ...term.ferramentaRelacionada, nome: TOOL_LABELS[lang][term.ferramentaRelacionada.nome] || term.ferramentaRelacionada.nome }
      : undefined,
  };
}

export function categoryLabel(categoria: DictionaryTerm['categoria'], lang: 'en' | 'pt' | 'es'): string {
  return lang === 'en' ? categoria : CATEGORY_LABELS[lang][categoria];
}
