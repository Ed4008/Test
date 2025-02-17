const SUPABASE_URL = 'https://zziqvyaqorsuxxyruiwr.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6aXF2eWFxb3JzdXh4eXJ1aXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3MDE2MTQsImV4cCI6MjA1NDI3NzYxNH0.fkcuUJp9uhxKdoGniDk3V0quSpwMZL2gr8GcxMXCYgQ';

const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Verificar autenticação inicial
(async () => {
    const { data: { user } } = await client.auth.getUser();
    if (user) window.location.href = 'cursos.html';
})();

// Alternar entre formulários
document.querySelectorAll('.toggle-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.auth-section').forEach(section => {
            section.style.display = 'none';
        });
        document.querySelector(e.target.getAttribute('href')).style.display = 'block';
    });
});

// Cadastro
document.getElementById('form-cadastro').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userData = {
        nome: document.getElementById('nome').value.trim(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        senha: document.getElementById('senha').value
    };

    try {
        // Validar dados
        if (!userData.nome || !userData.email || !userData.senha) {
            throw new Error('Preencha todos os campos!');
        }
        if (userData.senha.length < 6) {
            throw new Error('A senha deve ter pelo menos 6 caracteres!');
        }

        // Criar usuário
        const { data: authData, error: authError } = await client.auth.signUp({
            email: userData.email,
            password: userData.senha
        });

        if (authError) throw authError;

        // Salvar dados adicionais
        const { error: dbError } = await client
            .from('usuarios')
            .insert([{
                nome: userData.nome,
                email: userData.email,
                user_id: authData.user.id
            }]);

        if (dbError) throw dbError;

        alert('Cadastro realizado com sucesso!');
        window.location.href = 'cursos.html';
    } catch (error) {
        alert(`Erro: ${error.message}`);
        console.error('Erro detalhado:', error);
    }
});

// Login
document.getElementById('form-login').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const credentials = {
        email: document.getElementById('login-email').value.trim().toLowerCase(),
        password: document.getElementById('login-senha').value
    };

    try {
        const { data, error } = await client.auth.signInWithPassword(credentials);
        
        if (error) throw error;
        
        window.location.href = 'cursos.html';
    } catch (error) {
        alert(`Erro no login: ${error.message}`);
        console.error('Erro detalhado:', error);
    }
});

// Logout
document.querySelector('a[href="index.html"]')?.addEventListener('click', async (e) => {
    e.preventDefault();
    await client.auth.signOut();
    window.location.href = 'index.html';
});
