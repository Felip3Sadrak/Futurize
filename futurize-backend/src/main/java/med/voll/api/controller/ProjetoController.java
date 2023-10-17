package med.voll.api.controller;

import jakarta.validation.Valid;
import med.voll.api.projeto.DadosCadastroProjeto;
import med.voll.api.projeto.DadosListagemProjeto;
import med.voll.api.projeto.Projeto;
import med.voll.api.projeto.ProjetoRepository;
import med.voll.api.usuario.Usuario;
import med.voll.api.usuario.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("Projeto")
public class ProjetoController {

    @Autowired
    private ProjetoRepository repository;

    @CrossOrigin(origins = "*", allowedHeaders = "")
    @PostMapping
    @Transactional
    public void CadastrarProjeto(@RequestBody @Valid DadosCadastroProjeto dadosCadastroProjeto){
        repository.save(new Projeto(dadosCadastroProjeto));
    }

    @CrossOrigin(origins = "*", allowedHeaders = "")
    @GetMapping
    public List<DadosListagemProjeto> listarProjeto(){
        return repository.findAll().stream().map(DadosListagemProjeto::new).toList();
    }
    
    
}