import sys, io, pikepdf
from pikepdf import PdfImage, Name
from PIL import Image
src, dst = sys.argv[1], sys.argv[2]
pdf = pikepdf.open(src); vus = {}
n = 0
for obj in pdf.objects:
    if not isinstance(obj, pikepdf.Stream) or obj.get('/Subtype') != Name.Image: continue
    if True:
        try:
            if obj.get('/Filter') == Name.DCTDecode or len(obj.read_raw_bytes()) < 150000: continue
            im = PdfImage(obj).as_pil_image()
            if im.mode not in ('RGB', 'L'): im = im.convert('RGB')
            b = io.BytesIO(); im.save(b, 'JPEG', quality=82, optimize=True)
            if b.tell() >= len(obj.read_raw_bytes()): continue
            obj.write(b.getvalue(), filter=Name.DCTDecode)
            obj.ColorSpace = Name.DeviceRGB if im.mode == 'RGB' else Name.DeviceGray
            obj.BitsPerComponent = 8; n += 1
            for c in ('/DecodeParms', '/Decode'):
                if c in obj: del obj[c]
        except Exception as e: print('saute', e)
print('images refaites', n); pdf.save(dst, compress_streams=True, object_stream_mode=pikepdf.ObjectStreamMode.generate)
