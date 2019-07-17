
import { Fragment } from 'react';
import { Collapse, Divider, Steps, Popover, BackTop } from 'antd';

const { Step } = Steps;
const { Panel } = Collapse;

const dataFaqFIM = [
  {
    header: 'Apakah FIM memiliki afiliasi dengan ormas/partai politik?',
    body: 'FIM adalah forum independen yang beranggotakan pemuda-pemudi Indonesia dari berbagai latar belakang minat dan aktivitas, universitas maupun lembaga kepemudaan, baik di Indonesia maupun di luar negeri. FIM merupakan organisasi kepemudaan yang tidak berafiliasi dengan ormas atau partai politik manapun.'
  },
  {
    header: 'Apa itu pelatihan nasional?',
    body: 'Pelatihan nasional adalah aktivitas yang bertujuan untuk meningkatkan kapasitas peserta FIM 21 mulai dari softskill, internalisasi nilai-nilai FIM, serta memperluas dan menguatkan jaringan pemuda Indonesia.'
  },
  {
    header: 'Seperti apa model pelatihan nasional?',
    body: '<i>Bootcamp training</i> (pelatihan intensif) selama 3-4 hari di akhir pekan, yang akan diikuti oleh 200 peserta dari seluruh wilayah di Indonesia.'
  },
  {
    header: 'Apa itu FIM regional?',
    body: 'Setelah 5 tahun bergerak, FIM mulai membangun model gerakan yang berbasis regional agar visi pemberdayaan dimulai tidak hanya dari Jakarta. Sejak 2017, para penggerak regional disebut Kader Next-Gen. Program regional berbasis pada pemberdayaan masyarakat di daerah masing-masing.'
  },
  {
    header: 'Kader Next-Gen itu siapa dan apa tugasnya?',
    body: 'Di pelatihan FIM 21 ini, kader next-gen khusus diperuntukkan bagi pemuda/i berusia 18-25 tahun yang telah mengikuti Pelatihan Wilayah Forum Indonesia Muda 20 (<b>Alumni FIM 20</b>) pada tahun 2018 lalu dan telah aktif membangun kegiatan di regionalnya serta berkomitmen untuk meningkatkan potensi regional melalui pelatihan nasional.'
  },
  {
    header: 'Jalur apa saja yang ada di non next-gen dan apa deskripsinya?',
    body: `<ul>
      <li><i>Campus Leader</i> adalah calon peserta FIM yang merupakan pimpinan/aktivis atau calon pemimpin kampus yang memiliki misi untuk mendapat posisi strategis di organisasi kemahasiswaan.</li>
      <li><i>Local Leader</i> adalah calon peserta FIM yang merupakan pegiat yang fokus membangun kapasitas atau pemberdayaan masyarakat lokal di lingkungan daerah tempat tinggalnya.</li>
      <li><i>Influencer</i> diperuntukan bagi calon peserta FIM yang mewakili spirit dan karakter generasi millennial sebagai digital influencer, tech savvy dengan jangkauan network yang luas</li>
      <li><i>Young Expert</i> merupakan jalur yang menyasar pada anak muda yang bercita-cita/telah  menjadi expert/specialist di bidang/keilmuan tertentu.</li>
      <li><i>Young Professional</i> merupakan calon peserta yang berasal dari profesional muda yang telah bekerja selama 1-5 tahun setelah lulus kuliah. Bagi profesional muda yang berasal dari perusahaan yang masuk dalam 500 Fortune Indonesia akan menjadi prioritas.</li>
      <li><i>Public Servant</i> diperuntukan bagi calon peserta merupakan anak muda yang mengambil karir sebagai aparatur sipil negara.</li>
      <li><i>Military</i> adalah jalur khusus yang diadakan untuk para calon pemimpin Indonesia di masa depan yang berasal dari militer (AD, AL, AU, dan polisi).</li>
    </ul>`
  },
  {
    header: 'Apakah calon peserta yang berasal dari alumni FIM 20 dapat memilih jalur non next-gen?',
    body: 'Ya, alumni FIM 20 dapat mendaftar melalui jalur non next-gen sesuai deskripsi jalur pendaftaran di atas.'
  },
]

const dataFaqFIM21 = [
  {
    header: 'Apakah pelatihan Forum Indonesia Muda berbayar?',
    body: 'Biaya kegiatan, konsumsi, dan akomodasi selama pelatihan akan ditanggung oleh panitia. Peserta harus menanggung <b>biaya transportasi sendiri menuju dan pulang dari lokasi pelatihan di Jakarta.</b> Selain itu, peserta yang lolos seleksi akan dikenai <b>biaya penggantian training kit,</b> juga sebagai jaminan komitmen untuk hadir di pelatihan​ sehingga tidak melalaikan amanah setelah terpilih dari ribuan calon peserta.'
  },
  {
    header: 'Bagaimana jika peserta mengalami kendala dalam hal biaya transportasi?',
    body: 'Pengalaman dari para peserta sebelumnya, peserta dapat mengajukan proposal ke pihak terkait yang dapat menjadi donatur. Panitia akan membantu dengan mengirimkan surat keterangan mengikuti acara dan proposal kegiatan. Permohonan surat keterangan tersebut bisa diajukan kepada panitia paling lambat 1 (satu) pekan setelah pengumuman daftar nama peserta fiks dari panitia.'
  },
  {
    header: 'Bagaimana bila jadwal acara berbarengan dengan jadwal kuliah dan ujian, tetapi calon peserta ingin sekali mengikuti acara ini?',
    body: 'Panitia akan membantu dengan mengirimkan surat keterangan lolos seleksi yang ditujukan kepada dekan atau dosen yang bersangkutan. Materi pelatihan FIM disusun sedemikian rupa dan saling berkaitan. Peserta wajib mengikuti keseluruhan rangkaian acara. Tidak ada toleransi izin untuk keluar lokasi pelatihan, walaupun kampus peserta berada berdekatan dengan lokasi pelatihan.'
  },
  {
    header: 'Surat rekomendasi itu seperti apa?',
    body: 'Surat rekomendasi adalah salah satu berkas pendaftaran yang berisi rekomendasi untuk mengikuti pelatihan FIM 21. Surat rekomendasi ini dapat diberikan oleh <b>siapapun</b>, baik itu teman baik, dosen, tokoh masyarakat, pemuka adat, petinggi organisasi, petinggi partai, atau alumni FIM. Rekomendasi diminta kepada orang yang kenal baik dengan calon peserta. Setiap calon peserta hanya diperkenankan untuk melampirkan ​​<b>satu rekomendasi saja</b>. Format surat rekomendasi telah dibuat oleh panitia dan calon peserta dapat mengunduhnya saat mengisi isian pendaftaran.'
  },
  {
    header: 'Bagaimana memasukkan surat rekomendasi bertanda tangan?',
    body: 'Sebelumnya, surat rekomendasi bertanda tangan dapat di-scan atau difoto terlebih dahulu, atau pada softcopy dapat dimasukkan gambar tanda tangan (asli ditandatangani oleh pemberi rekomendasi) dalam format gambar atau dokumen. Setelah itu, <i>file softcopy</i> diunggah ke dalam formulir pendaftaran. Mekanisme yang sama untuk surat pernyataan komitmen bertanda tangan.'
  },
  {
    header: 'Apakah surat rekomendasi boleh lebih dari satu?',
    body: '<b>Tidak.</b> Cukup lampirkan satu surat rekomendasi terbaik, sesuai dengan format yang telah disediakan di portal pendaftaran.'
  },
]

function FaqFIM() {
  return (<Fragment>
    <Divider orientation="left">FAQ Seputar FIM</Divider>
    <Collapse accordion>
      {
        dataFaqFIM.map((data, index) => {
          return <Panel header={data.header} key={index}>
            <p dangerouslySetInnerHTML={{ __html: data.body }} />
          </Panel>
        })
      }
    </Collapse>
  </Fragment>)
}

function FaqFIM21() {
  return (<Fragment>
    <Divider orientation="left">FAQ Seputar Pelatihan Fim 21</Divider>
    <Collapse accordion>
      {
        dataFaqFIM21.map((data, index) => {
          return <Panel header={data.header} key={index}>
            <p dangerouslySetInnerHTML={{ __html: data.body }} />
          </Panel>
        })
      }
    </Collapse>
  </Fragment>)
}

function StepRegis() {
  return (<Fragment>
    <Divider>Tahapan Pendaftaran</Divider>
    <Steps current={0}>
      <Step title="Pembukaan pendaftaran" description="17 Juli 2019" />
      <Step title="Penutupan pendaftaran" description="17 Agustus 2019" />
      <Step title="Pengumuman lolos tahap 1" description="7 September 2019" />
      <Step title="Seleksi tahap 2 (wawancara)" description="8 - 13 September 2019" />
      <Step title="Pengumuman lolos tahap 2" description="18 September 2019" />
      <Step title="Masa konfirmasi" description="18 – 21 September 2019" />
    </Steps>
  </Fragment>)
}

function Faq() {
  return (<Fragment>
    {StepRegis()}
    {FaqFIM()}
    {FaqFIM21()}
    <BackTop />
  </Fragment>)
}

export default Faq;