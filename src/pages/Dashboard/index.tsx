import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';
import formatValue from '../../utils/formatValue';
import formatData from '../../utils/formatData';

import api from '../../services/api';

import Header from '../../components/Header';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

const Dashboard: React.FC = () => {
  const [transactionList, setTransactions] = useState<Transaction[]>([]);
  const [balancesValues, setBalance] = useState<Balance | null>({} as Balance);

  useEffect(() => {
    api.get('/transactions').then(response => {
      const { balance, transactions } = response.data;

      setTransactions(transactions);
      setBalance(balance);
    });
  }, []);

  return (
    <>
      <Header />
      <Container>
        {balancesValues && (
          <CardContainer>
            <Card>
              <header>
                <p>Entradas</p>
                <img src={income} alt="Income" />
              </header>
              <h1 data-testid="balance-income">{formatValue(balancesValues.income)}</h1>
            </Card>
            <Card>
              <header>
                <p>Saídas</p>
                <img src={outcome} alt="Outcome" />
              </header>
              <h1 data-testid="balance-outcome">{formatValue(balancesValues.outcome)}</h1>
            </Card>
            <Card total>
              <header>
                <p>Total</p>
                <img src={total} alt="Total" />
              </header>
              <h1 data-testid="balance-total">{formatValue(balancesValues.total)}</h1>
            </Card>
          </CardContainer>
        )}

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>
            {transactionList &&
              transactionList.map(transaction => (
                <tbody>
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td className={transaction.type}>
                      {transaction.type === 'income'
                        ? formatValue(transaction.value)
                        : "- " + formatValue(transaction.value)
                      }
                    </td>
                    <td>{transaction.category.title}</td>
                    <td>{formatData(transaction.created_at)}</td>
                  </tr>
                </tbody>
              ))}
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
