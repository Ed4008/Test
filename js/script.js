const SUPABASE_URL = 'https://zziqvyaqorsuxxyruiwr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6aXF2eWFxb3JzdXh4eXJ1aXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MDE2MTQsImV4cCI6MjA1NDI3NzYxNH0.fkcuUJp9uhxKdoGniDk3V0quSpwMZL2gr8GcxMXCYgQ';
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Cadastro de usuário
document.getElementById('form-cadastro').addEventListener('submit', async function(event) {
  event.preventDefault();
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  try {
    // Criar usuário no Supabase Auth
    const { data: { user }, error: authError } = await client.auth.signUp({ 
      email, 
      password: senha 
    });

    if (authError) {
      throw new Error(authError.message || "Erro ao criar usuário na autenticação");
    }

    // Inserir dados na tabela 'usuarios'
    const { data, error: dbError } = await client
      .from('usuarios')
      .insert([{ 
        nome, 
        email,
        user_id: user.id 
      }]);

    if (dbError) {
      throw new Error(dbError.message || "Erro ao salvar dados no banco");
    }

    alert('Cadastro realizado com sucesso!');
    window.location.href = 'cursos.html';

  } catch (error) {
    console.error("Detalhes do erro:", error);
    alert('Erro no cadastro: ' + (error.message || "Erro desconhecido"));
  }
});

// Login de usuário
document.getElementById('form-login').addEventListener('submit', async function(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const senha = document.getElementById('login-senha').value;

  try {
    // Realiza o login com Supabase Auth
    const { data, error } = await client.auth.signInWithPassword({
      email: email,
      password: senha
    });

    if(error) {
      throw new Error(error.message || "Erro ao realizar login");
    }

    alert('Login realizado com sucesso!');
    window.location.href = 'cursos.html';

  } catch (error) {
    console.error("Detalhes do erro:", error);
    alert('Erro no login: ' + (error.message || "Erro desconhecido"));
  }
});
