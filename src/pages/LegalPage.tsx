import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type Lang = 'en' | 'pt' | 'es';
type Kind = 'privacy' | 'terms';
type Doc = { title: string; updated: string; sections: { h: string; p: string[] }[] };

const EMAIL = 'aurenstarbusiness@gmail.com';
const UPDATED = { en: 'Last updated: November 4, 2026', pt: 'Última atualização: 4 de novembro de 2026', es: 'Última actualización: 4 de noviembre de 2026' };

const DOCS: Record<Kind, Record<Lang, Doc>> = {
  privacy: {
    en: {
      title: 'Privacy Policy',
      updated: UPDATED.en,
      sections: [
        { h: 'What we collect', p: ['When you use a tool, you may type your name, birth date, birth time and birth city. We use them only to create your reading. We do not ask for passwords or payment details.', 'If you subscribe to the newsletter, we save your email, your sign (if you choose one), the language, the date and the sentence you agreed to, and we use it only to send Aurenstar news and new articles. The t-shirt list is a separate list. If you join the t-shirt waiting list, we save your email, your star sign, your language, the date and the sentence you agreed to (you must tick the box). We use it only to tell you when Aurenstar t-shirts launch, and you can leave the list at any time by writing to us. If you write to us, we use your email only to answer you.', 'The thumbs up / thumbs down under a result is anonymous: we save only the tool, your vote, the star sign and the language, never who you are.', 'If you leave a comment on the site, we save the text, the rating, your first name (optional) and your country (a 2-letter code, used to show a flag; we do not keep your IP address). A comment only appears after it is checked (automatically by an AI tool and, when in doubt, by us), and Comments older than a month are moved to a private archive file (not public) that we use only to improve the site; you can ask us to remove it by writing to us. Please do not put personal details in it.'] },
        { h: 'How your data is used', p: ['Your birth details are sent to our calculation service (the sky is calculated with the Swiss Ephemeris) and to technology providers that help us write and translate your reading. They are used only to produce the result you asked for.', 'We keep a short-lived copy of a reading so the same person does not receive different readings by accident, and a scrambled (hashed) form of your network address to limit abuse. We cannot read a person from it.', 'Your last results are also saved in your own browser, so you can come back to them. You can clear them at any time by clearing your browser data.'] },
        { h: 'Cookies and measurement', p: ['With your permission we use Google Analytics to count visits (which pages, which countries). If you choose "Only essential", no measurement cookies are used. You can change your choice any time with the "Cookie settings" link in the footer.', 'The site is supported by advertising. Our advertising partners may use cookies to show ads; you can control them in your browser or ad settings.'] },
        { h: 'Who else sees data', p: ['We use Cloudflare to host the site and protect it from robots, and Supabase to store short-lived data. We do not sell your personal data.'] },
        { h: 'Your rights', p: [`You can ask us to see, correct or delete the data we hold about you. Write to ${EMAIL}. If you live in the European Union, the United Kingdom, Brazil or California, you have extra rights under the GDPR, LGPD and CCPA, and we will honor them.`] },
        { h: 'Children', p: ['Aurenstar is not made for children under 13, and we do not knowingly collect their data.'] },
        { h: 'Changes', p: ['If we change this policy, we will update the date at the top of this page.'] },
      ],
    },
    pt: {
      title: 'Política de Privacidade',
      updated: UPDATED.pt,
      sections: [
        { h: 'O que coletamos', p: ['Ao usar uma ferramenta, você pode digitar seu nome, data, hora e cidade de nascimento. Usamos esses dados só para criar a sua leitura. Não pedimos senhas nem dados de pagamento.', 'Se você assina a newsletter, guardamos o seu e-mail, o signo (se você escolher), o idioma, a data e a frase com a qual você concordou, e usamos só para enviar novidades e novos artigos da Aurenstar. A lista das camisetas é outra lista, separada. Se você entra na lista de espera das camisetas, guardamos o seu e-mail, o seu signo, o idioma, a data e a frase com a qual você concordou (você precisa marcar a caixinha). Usamos isso só para avisar quando as camisetas da Aurenstar forem lançadas, e você pode sair da lista quando quiser, escrevendo para nós. Se você nos escreve, usamos o seu e-mail só para responder.', 'O 👍 / 👎 embaixo de um resultado é anônimo: guardamos só a ferramenta, o seu voto, o signo e o idioma, nunca quem você é.', 'Se você deixa um comentário no site, guardamos o texto, a nota, o primeiro nome (opcional) e o seu país (um código de 2 letras, usado para mostrar a bandeira; não guardamos o seu endereço IP). O comentário só aparece depois de conferido (automaticamente por uma ferramenta de IA e, na dúvida, por nós), e Comentários com mais de um mês vão para um arquivo privado (não público) que usamos só para melhorar o site; você pode pedir para removê-lo escrevendo para nós. Não escreva dados pessoais nele.'] },
        { h: 'Como usamos os seus dados', p: ['Os dados de nascimento vão para o nosso serviço de cálculo (o céu é calculado com o Swiss Ephemeris) e para provedores de tecnologia que nos ajudam a escrever e traduzir a sua leitura. Eles servem apenas para gerar o resultado que você pediu.', 'Guardamos por pouco tempo uma cópia da leitura, para a mesma pessoa não receber leituras diferentes por engano, e uma forma embaralhada (hash) do seu endereço de rede, para limitar abusos. Não conseguimos identificar uma pessoa por ela.', 'Seus últimos resultados também ficam salvos no seu próprio navegador, para você voltar a eles. Você pode apagá-los a qualquer momento limpando os dados do navegador.'] },
        { h: 'Cookies e medição', p: ['Com a sua permissão, usamos o Google Analytics para contar visitas (quais páginas, quais países). Se você escolher "Só os essenciais", nenhum cookie de medição é usado. Você pode mudar a escolha quando quiser pelo link "Configurar cookies" no rodapé.', 'O site é mantido com anúncios. Nossos parceiros de publicidade podem usar cookies para mostrar anúncios; você pode controlá-los no navegador ou nas configurações de anúncios.'] },
        { h: 'Quem mais vê os dados', p: ['Usamos a Cloudflare para hospedar o site e protegê-lo de robôs, e o Supabase para guardar dados de curta duração. Não vendemos os seus dados pessoais.'] },
        { h: 'Seus direitos', p: [`Você pode pedir para ver, corrigir ou apagar os dados que temos sobre você. Escreva para ${EMAIL}. Se você mora na União Europeia, no Reino Unido, no Brasil ou na Califórnia, tem direitos extras pelas leis GDPR, LGPD e CCPA, e vamos respeitá-los.`] },
        { h: 'Crianças', p: ['A Aurenstar não é feita para menores de 13 anos, e não coletamos dados deles de propósito.'] },
        { h: 'Mudanças', p: ['Se mudarmos esta política, atualizamos a data no topo desta página.'] },
      ],
    },
    es: {
      title: 'Política de Privacidad',
      updated: UPDATED.es,
      sections: [
        { h: 'Qué recopilamos', p: ['Al usar una herramienta, puedes escribir tu nombre, fecha, hora y ciudad de nacimiento. Los usamos solo para crear tu lectura. No pedimos contraseñas ni datos de pago.', 'Si te suscribes a la newsletter, guardamos tu correo, tu signo (si lo eliges), el idioma, la fecha y la frase con la que aceptaste, y lo usamos solo para enviar novedades y nuevos artículos de Aurenstar. La lista de camisetas es otra lista, separada. Si entras en la lista de espera de las camisetas, guardamos tu correo, tu signo, el idioma, la fecha y la frase con la que estuviste de acuerdo (debes marcar la casilla). Lo usamos solo para avisarte cuando se lancen las camisetas de Aurenstar, y puedes salir de la lista cuando quieras escribiéndonos. Si nos escribes, usamos tu correo solo para responderte.', 'El 👍 / 👎 bajo un resultado es anónimo: guardamos solo la herramienta, tu voto, el signo y el idioma, nunca quién eres.', 'Si dejas un comentario en el sitio, guardamos el texto, la nota, tu primer nombre (opcional) y tu país (un código de 2 letras, para mostrar la bandera; no guardamos tu dirección IP). El comentario solo aparece después de ser comprobado (automáticamente por una herramienta de IA y, en caso de duda, por nosotros), y Los comentarios de más de un mes pasan a un archivo privado (no público) que usamos solo para mejorar el sitio; puedes pedir que lo eliminemos escribiéndonos. No pongas datos personales en él.'] },
        { h: 'Cómo usamos tus datos', p: ['Tus datos de nacimiento van a nuestro servicio de cálculo (el cielo se calcula con Swiss Ephemeris) y a proveedores de tecnología que nos ayudan a escribir y traducir tu lectura. Se usan solo para producir el resultado que pediste.', 'Guardamos por poco tiempo una copia de la lectura, para que la misma persona no reciba lecturas distintas por error, y una forma codificada (hash) de tu dirección de red, para limitar abusos. No podemos identificar a una persona con ella.', 'Tus últimos resultados también se guardan en tu propio navegador, para que puedas volver a ellos. Puedes borrarlos cuando quieras limpiando los datos del navegador.'] },
        { h: 'Cookies y medición', p: ['Con tu permiso usamos Google Analytics para contar visitas (qué páginas, qué países). Si eliges "Solo esenciales", no se usa ninguna cookie de medición. Puedes cambiar tu elección cuando quieras en el enlace "Configurar cookies" del pie de página.', 'El sitio se mantiene con publicidad. Nuestros socios publicitarios pueden usar cookies para mostrar anuncios; puedes controlarlas en tu navegador o en la configuración de anuncios.'] },
        { h: 'Quién más ve los datos', p: ['Usamos Cloudflare para alojar el sitio y protegerlo de robots, y Supabase para guardar datos de corta duración. No vendemos tus datos personales.'] },
        { h: 'Tus derechos', p: [`Puedes pedir ver, corregir o borrar los datos que tenemos sobre ti. Escribe a ${EMAIL}. Si vives en la Unión Europea, el Reino Unido, Brasil o California, tienes derechos adicionales bajo GDPR, LGPD y CCPA, y los respetaremos.`] },
        { h: 'Niños', p: ['Aurenstar no está hecha para menores de 13 años, y no recopilamos sus datos a propósito.'] },
        { h: 'Cambios', p: ['Si cambiamos esta política, actualizaremos la fecha al inicio de esta página.'] },
      ],
    },
  },
  terms: {
    en: {
      title: 'Terms of Service',
      updated: UPDATED.en,
      sections: [
        { h: 'About Aurenstar', p: ['Aurenstar offers astrology content and tools for reflection and entertainment. Readings are not predictions of the future.'] },
        { h: 'Not advice', p: ['What you read here is not medical, legal, financial or psychological advice. For important decisions, talk to a qualified professional. If you feel unwell or in crisis, contact local emergency services or a mental health professional.'] },
        { h: 'Using the site', p: ['You may use the site for personal, non-commercial purposes. Please do not misuse it: no automated copying of the site, no attempts to overload or break it, and no use of it to harm others.'] },
        { h: 'Our content', p: ['The texts, designs and tools are ours or used with permission. You may share a link and the cards the site lets you share. Do not copy large parts of the site to publish elsewhere without asking us first.'] },
        { h: 'Third-party links', p: ['The site may link to other sites. We are not responsible for what they say or do.'] },
        { h: 'No guarantees', p: ['We do our best to keep the site correct and available, but we provide it "as is", without guarantees, and we may change or stop parts of it at any time.'] },
        { h: 'Contact', p: [`Questions about these terms: ${EMAIL}.`] },
      ],
    },
    pt: {
      title: 'Termos de Uso',
      updated: UPDATED.pt,
      sections: [
        { h: 'Sobre a Aurenstar', p: ['A Aurenstar oferece conteúdos e ferramentas de astrologia para reflexão e entretenimento. As leituras não são previsões do futuro.'] },
        { h: 'Não é aconselhamento', p: ['O que você lê aqui não é conselho médico, jurídico, financeiro nem psicológico. Para decisões importantes, converse com um profissional qualificado. Se você se sente mal ou em crise, procure os serviços de emergência locais ou um profissional de saúde mental.'] },
        { h: 'Uso do site', p: ['Você pode usar o site para fins pessoais e sem fins comerciais. Por favor, não abuse dele: nada de cópia automática do site, tentativas de sobrecarregá-lo ou quebrá-lo, nem uso para prejudicar outras pessoas.'] },
        { h: 'Nosso conteúdo', p: ['Os textos, os designs e as ferramentas são nossos ou usados com permissão. Você pode compartilhar um link e os cards que o site permite compartilhar. Não copie grandes partes do site para publicar em outro lugar sem nos perguntar antes.'] },
        { h: 'Links de terceiros', p: ['O site pode ter links para outros sites. Não somos responsáveis pelo que eles dizem ou fazem.'] },
        { h: 'Sem garantias', p: ['Fazemos o possível para manter o site correto e no ar, mas ele é oferecido "como está", sem garantias, e podemos mudar ou encerrar partes dele a qualquer momento.'] },
        { h: 'Contato', p: [`Dúvidas sobre estes termos: ${EMAIL}.`] },
      ],
    },
    es: {
      title: 'Términos de Uso',
      updated: UPDATED.es,
      sections: [
        { h: 'Sobre Aurenstar', p: ['Aurenstar ofrece contenidos y herramientas de astrología para la reflexión y el entretenimiento. Las lecturas no son predicciones del futuro.'] },
        { h: 'No es asesoramiento', p: ['Lo que lees aquí no es consejo médico, legal, financiero ni psicológico. Para decisiones importantes, habla con un profesional calificado. Si te sientes mal o en crisis, contacta a los servicios de emergencia locales o a un profesional de salud mental.'] },
        { h: 'Uso del sitio', p: ['Puedes usar el sitio con fines personales y no comerciales. Por favor, no abuses de él: nada de copia automática del sitio, intentos de sobrecargarlo o romperlo, ni uso para perjudicar a otras personas.'] },
        { h: 'Nuestro contenido', p: ['Los textos, diseños y herramientas son nuestros o se usan con permiso. Puedes compartir un enlace y las tarjetas que el sitio permite compartir. No copies grandes partes del sitio para publicarlas en otro lugar sin preguntarnos antes.'] },
        { h: 'Enlaces de terceros', p: ['El sitio puede tener enlaces a otros sitios. No somos responsables de lo que dicen o hacen.'] },
        { h: 'Sin garantías', p: ['Hacemos lo posible por mantener el sitio correcto y disponible, pero se ofrece "tal cual", sin garantías, y podemos cambiar o cerrar partes de él en cualquier momento.'] },
        { h: 'Contacto', p: [`Preguntas sobre estos términos: ${EMAIL}.`] },
      ],
    },
  },
};

const BACK: Record<Lang, string> = { en: 'Back to Home', pt: 'Voltar ao Início', es: 'Volver al Inicio' };

export const LegalPage: React.FC<{ kind: Kind; onBackToHome: () => void }> = ({ kind, onBackToHome }) => {
  const { language } = useLanguage();
  const lang = (language === 'pt' || language === 'es' ? language : 'en') as Lang;
  const doc = DOCS[kind][lang];
  return (
    <div className="w-full bg-[#C9E5FF] min-h-screen pt-24 sm:pt-28 pb-20 text-[#172B4D]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="mb-8 pb-4 border-b border-[#D9E8F8]">
          <button type="button" onClick={onBackToHome} className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#647DA5] hover:text-[#172B4D] transition-colors cursor-pointer group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>{BACK[lang]}</span>
          </button>
        </div>
        <div className="bg-white rounded-3xl border border-[#D9E8F8] shadow-sm p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B4D] mb-1">{doc.title}</h1>
          <p className="text-xs text-[#647DA5] mb-6">{doc.updated}</p>
          {doc.sections.map((s) => (
            <section key={s.h} className="mb-6 last:mb-0">
              <h2 className="text-lg font-bold text-[#17366F] mb-2">{s.h}</h2>
              {s.p.map((t, i) => (
                <p key={i} className="text-sm leading-relaxed text-[#647DA5] mb-2">{t}</p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};
