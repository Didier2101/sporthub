# Liga Ágil App - Documentación de Despliegue

## Servicio SystemD

Esta aplicación está configurada para ejecutarse como un servicio de systemd llamado `sporthub`.

### Configuración del Servicio
ssh -J didier@186.155.39.46 -L 4000:192.168.2.47:5050 vetlink@192.168.2.50

El servicio está ubicado en: `/etc/systemd/system/sporthub.service`

```ini
[Unit]
Description=SportHub Next.js Application
After=network.target

[Service]
Type=simple
User=vetlink
WorkingDirectory=/home/vetlink/liga_agil_app
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
SyslogIdentifier=sporthub

[Install]
WantedBy=multi-user.target
```

### Comandos Útiles

#### Gestión del Servicio

```bash
# Ver estado del servicio
sudo systemctl status sporthub

# Iniciar el servicio
sudo systemctl start sporthub

# Detener el servicio
sudo systemctl stop sporthub

# Reiniciar el servicio
sudo systemctl restart sporthub

# Habilitar inicio automático
sudo systemctl enable sporthub

# Deshabilitar inicio automático
sudo systemctl disable sporthub
```

#### Ver Logs

```bash
# Ver logs en tiempo real
sudo journalctl -u sporthub -f

# Ver últimos logs
sudo journalctl -u sporthub -n 100

# Ver logs desde hoy
sudo journalctl -u sporthub --since today

# Ver logs con más detalle
sudo journalctl -u sporthub -xe
```

### Proceso de Actualización

Cuando hagas cambios en el código:

```bash
# 1. Construir la aplicación
npm run build

# 2. Reiniciar el servicio
sudo systemctl restart sporthub

# 3. Verificar que esté funcionando
sudo systemctl status sporthub
```

### Modificar el Servicio

Si necesitas cambiar la configuración del servicio:

```bash
# 1. Editar el archivo
sudo nano /etc/systemd/system/sporthub.service

# 2. Recargar systemd
sudo systemctl daemon-reload

# 3. Reiniciar el servicio
sudo systemctl restart sporthub
```

### Información del Servidor

- **URL Local:** http://localhost:3000
- **URL Red:** http://192.168.2.50:3000
- **Usuario:** vetlink
- **Directorio:** /home/vetlink/liga_agil_app
- **Puerto:** 3000

