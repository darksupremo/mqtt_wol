# MQTT_WOL  
**Wake On Lan**  
- Multiplatform  

**Shutdown (Actually, it does use the Hibernate command, my preference.)**  
- Currently Windows only

### Example wake:
MQTT Topic: **wol/toggle**  
Message: **1**

### Example shutdown:
MQTT Topic: **wol/toggle**  
Message: **0**

**Shutdown** requires **SSH Server** to be enabled: https://docs.microsoft.com/pt-br/windows-server/administration/openssh/openssh_install_firstuse

#### Required Environment Variables:
- **WOL_HOST** - _Host IP Address (Shutdown)_
- **WOL_USER** - _Host User (Shutdown)_
- **WOL_PASS** - _Host Password (Shutdown)_
- **WOL_MAC** - _Host MAC-Address (Wake)_
- **WOL_BROADCAST_ADDR** - _Network broadcast address, eg: 192.168.0.255 (Wake)_
- **MQ_HOST** - _MQTT Host_
- **MQ_USER** - _MQTT User_
- **MQ_PASS** - _MQTT Password_