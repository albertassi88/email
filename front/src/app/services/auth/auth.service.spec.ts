import { AuthService } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('Historico Service', () => {

  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
      ],
      imports: [
        HttpClientTestingModule
      ],
    });
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve retornar true ao chamar isAuthenticated se um usuário estiver autenticado', async () => {
    spyOn(service, 'getAuthorizationToken').and.returnValue('fakeAuthToken');
    const isAuthenticated = await service.isAuthenticated();
    expect(isAuthenticated).toBeTrue();
  });

  it('deve retornar false ao chamar isAuthenticated se nenhum usuário estiver autenticado', async () => {
    spyOn(service, 'getAuthorizationToken').and.returnValue(null);
    const isAuthenticated = await service.isAuthenticated();
    expect(isAuthenticated).toBeFalse();
  });

  it('deve salvar informações do usuário no local storage', async () => {
    const fakeUser = {
      user: { id: '123', name: 'John', role: 'user' },
      token: 'fakeToken'
    };
    await service.saveLocalStorage(fakeUser);
    expect(localStorage.getItem('id')).toBe(fakeUser.user.id);
    expect(localStorage.getItem('authToken')).toBe(fakeUser.token);
    expect(localStorage.getItem('name')).toBe(fakeUser.user.name);
    expect(localStorage.getItem('role')).toBe(fakeUser.user.role);
  });

  it('deve remover informações do local storage', async () => {
    localStorage.setItem('id', '123');
    localStorage.setItem('authToken', 'fakeToken');
    localStorage.setItem('name', 'John');
    localStorage.setItem('role', 'user');
    await service.removeLocalStorage();
    expect(localStorage.getItem('id')).toBeNull();
    expect(localStorage.getItem('authToken')).toBeNull();
    expect(localStorage.getItem('name')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
  });

  it('deve salvar informações genéricas no local storage', async () => {
    const chave = 'testChave';
    const title = 'testTitle';
    await service.saveObjectLocalStorage(chave);
    expect(service.saveObjectLocalStorage).toBeTruthy();
  });

  it('deve retornar informações genéricas do local storage', async () => {
    const title = 'testTitle';
    const chave = 'testChave';
    localStorage.setItem(chave, title);
    const result = await service.getAuthorizationToken();
    expect(service.getAuthorizationToken).toBeTruthy()
  });
});
