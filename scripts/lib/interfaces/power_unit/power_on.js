const ftdiInfo = ftdi.getDeviceList({vendor: 0x0403, product: 0x6010});
const port      = utility.systemInfo().port
const version    = parseInt(ftdiInfo[0].serial.slice(5, 6));
let port_map    = [0, 1, 2, 3];  
let idx         = null;

try {
   idx = ftdi.open({vendor: 0x0403, product: 0x6010, serial: `AMS-V${version}-${port_map[port]}`, interface: 0x2});
}
catch(e) {
   throw new Error("[FAIL] Open power switching unit")
}

ftdi.setBitmode(idx, { bitmask: 0x0, mode: 0x2 });
const written = ftdi.write(idx, [0x82, 0xFF, 0xFF]);

ftdi.close(idx);