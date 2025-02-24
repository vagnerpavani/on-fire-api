1.  # **Stacks**

    ## Quais as tecnologias usadas?

    Para a API, escolhi utilizar NestJS, principalmente para facilitar a injeção de dependencia das minhas classes e lidar com as requisições HTTP e Typescript para facilitar o processo de desenvolvimento (Em react também)

    Além disso utilizei o banco relacional Postgres para montar minhas tabelas e guardar os dados. Esse desafio já implicava que precisaria usar SQL então escolhi o Postgres por ser o que estou mais acostumado.

    Também utilizei a biblioteca dayjs para lidar com a manipulação de datas, já que os casos de uso pediam bastante disso.

    Para a aplicação web utilizei React(Vite) para fazer as telas dinamicas. Acabei indo pelo caminho de usar o vite e não o Next porque não vi uma necessidade de criar uma página estática ou ranquear nas buscas do google, etc.

    Utilizei a biblioteca recharts para não precisar desenhar os gráficos do zero. E tailwindcss para facilitar a construção visual da interface. (Facilitou bastante para seguir o branding proposto.)

    ## Quais problemas você enfrentou ao desenvolver?

    Enfrentei alguns problemas. O primeiro deles foi planejamento. Esse desafio me puxou bastante nesse lado porque precisei voltar e mudar algumas coisas que já tinha feito por não ter para com a devida atenção para planejar os detalhes do que seria implementado. Isso é um ponto fraco meu e acho que ficou um aprendizado importante pra mim.
    Um segundo problema é que eu demorei a entender como eu deveria usar a API disponibilizada, achei que precisava buscar exatamente o postID que estava chegando mas depois percebi que os dados do post mudam a cada dia e só precisaria pegar o post do dia. Então servia para pegar aquele post mesmo. (Cheguei a enviar um email perguntando, obrigado novamente pela atenção, Geraldo.)
    E uma última dificuldade que tive, foi trabalhar diretamente com SQL depois de muito tempo usando ORMs. Precisei desenferrujar um pouco e senti que me tomou muito tempo ficar desserializando e montando os objetos no formato que eu precisava para os casos de uso. Mas acho que teve a vantagem de ter muito mais controle sobre as queries.
    Acho que esses foram os problemas principais mesmo.

    ## Qual a organização que escolheu e por quê?

    Deixei um tópico no README dos projetos falando da organização de cada um, mas vou repetir aqui, de forma resumida.

    Para a API, tentei seguir os princípios de arquitetura limpa, orientando o projeto aos casos de uso, tentando deixá-los o mais agnóstico possível das outras camadas de operação. Digo possível porque eu podia ter ido além fazendo adapters para as bibliotecas e interfaces para os repositories. Então fica aqui minha autocrítica. Sendo assim, organizei as camadas da seguinte forma => controllers – Cuidam das entradas e saídas HTTP. use-cases – Implementam as regras de negócio (são consumidos pela controller), repositories – Camada para abstrair as chamadas para o banco de dados e desserialização dos resultados. Entities – Camada abstrata para representar as entidades que tenho no banco.
    Na aplicação web, separei os componentes da seguinte forma: Componentes basicos - São os componentes mais simples e agnósticos, são usados para construir estruturas ou usados sozinhos. Eles não devem depender de nenhum outro componente, exceto se for algum Wrapper para uma lib de componentes. Componentes de estrutura – Componentes intermediários que são usados para construir seções consumindo os componentes básicos. Seções – Componentes com um contexto maior representando alguma seção da página. Podem consumir estruturas e componentes básicos. Página – É o componente de nível mais alto, que consome os outros para renderizar a página e estabelece o escopo dos componentes.

2.  # **Dados**

    ## Qual a estrutura do seu SQL?

    Utilizei 3 entidades principais para modelar esse problema. Users, Posts e Reads. Users representa os usuários que leem uma newsletter. Posts representa a newsletter com as informações úteis para o contexto do projeto. E por fim, Reads que é uma tabela meio entre essas duas para marcar quando um usuário marca um streak. Além disso, escolhi indexar a coluna de email e postId(beehiv) porque imaginei que teriam mais buscas através delas.

    ## Como você lida com as inserções e consultas dos leitores? Ele é escalável? Explique.

    Para as inserções sempre que um usuário buscar seu streak, ele será calculado e depois cacheado na coluna currentStreak do usuário. Assim quando precisar pegar esse dado novamente não preciso recalcular. Mas isso tem validade, então deixei uma rota para rodar um job diário para zerar o streak de quem perdeu a newsletter do dia. Isso facilita e deixa o processo escalável porque não preciso recalcular esse valor sempre que abro o dashboard por exemplo.

    As consultas podem melhorar, porque não cheguei a fazer paginação, por exemplo. Se o banco tivesse muitos milhares de reads para pegar, seria um problema.
    Fiquei em dúvida se seria melhor colocar o cálculo do streak diretamente no banco ou não, mas acabei optando por calcular fora do banco, para isolar as regras de negócio em um lugar só e não acoplar ao banco. Mas nesse cenário de ter muitos dados talvez fosse uma solução melhor porque o banco consegue lidar com esses dados com mais robustez do que arrastar tudo para a memória e calcular na hora.
    Concluindo, eu tentei me preocupar com a escalabilidade das features mas sei que tem muito espaço para melhorar.

3.  # Testes\*\*
    ## Quais testes você realizou?
    Realizei testes de integração nas rotas da API, para validar os casos de erro e se estava sendo enviado o que deveria. Realizei testes nos Dtos tambem, para garantir que estavam embarreirando as restrições certas. E testes manuais. Acabei desenvolvendo os testes depois de fazer as features, mas acho que teria me ajudado mais, fazer os testes mais cedo.
    Os casos de uso poderiam ser testados isoladamente também como testes unitários. No front end, só realizei testes manuais mesmo.
    ## Quanto tempo levou o desenvolvimento e testes?
    Acho que gastei umas 35< horas nesse projeto. Mas entre desenvolvimento e testes, acredito que juntando esses tipos de teste, deve dar umas 10 horas. Eu não marquei bem o tempo mas estou estimando.
