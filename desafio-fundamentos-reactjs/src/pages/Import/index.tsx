import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer, Error } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const [error, setError] = useState(false);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    setError(false);

    const responses = await Promise.all(
      uploadedFiles.map(async file => {
        const data = new FormData();
        data.append('file', file.file);

        try {
          return await api.post('/transactions/import', data);
        } catch (err) {
          return null;
        }
      }),
    );

    if (responses.some(item => item === null)) {
      setError(true);
    } else {
      history.push('/');
    }
  }

  function submitFile(files: File[]): void {
    const newUploadedFiles: FileProps[] = files.map(file => ({
      file,
      name: file.name,
      readableSize: filesize(file.size),
    }));

    setUploadedFiles(newUploadedFiles);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}
          {error && <Error>Erro ao importar arquivo(s)</Error>}
          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
