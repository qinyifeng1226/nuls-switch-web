<template>
  <div class="his-order bg-gray">
    <div class="bg-white">
      <div class="title font24 w1200">
        <div class="fl"><span>{{$t('orderInfo.depositTime')}}：</span>
          <el-date-picker class="input-class"
                v-model="depositTime"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </div>
        <div class="fl"><span>{{$t('orderInfo.tokenPair')}}：</span><SelectTokenBar @change="changeTokenType" :allType="1"></SelectTokenBar></div>
        <div class="fl"><span>{{$t('orderInfo.status')}}：</span><SelectBar v-model="status" :typeOptions="txStatusOptions" typeName="txStatus" @change="changeTxStatus"></SelectBar></div>
        <div class="fl" style="width: 50px;height: 20px"><el-button type="primary" @click="pagesDepositList()">{{$t('public.query')}}</el-button></div>
      </div>
    </div>
    <div class="cb"></div>
    <div class="bottoms w1200 cb">
      <el-table :data="depositList" stripe border class="mt_0 el-deposit-table"
                v-loading="depositListLoading">
        <el-table-column label="" width="30">
        </el-table-column>
        <el-table-column :label="$t('orderInfo.createTime')" width="170" align="left">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column :label="$t('orderInfo.txType')" width="120" align="left">
          <template slot-scope="scope">
            <span v-if="scope.row.txType ==1">{{$t('switch.buy')}}</span>
            <span v-else>{{$t('switch.sell')}}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('orderInfo.tokenPair')" width="170" align="left">
          <template slot-scope="scope">{{ scope.row.tokenPair }}</template>
        </el-table-column>
        <el-table-column :label="$t('orderInfo.price')" width="170" align="left">
          <template slot-scope="scope">{{ scope.row.price }}</template>
        </el-table-column>
        <el-table-column :label="$t('orderInfo.num')" width="170" align="left">
          <template slot-scope="scope">{{ scope.row.txNum }}/{{ scope.row.totalNum }}</template>
        </el-table-column>
        <el-table-column :label="$t('orderInfo.totalAmount')" width="170" align="left">
          <template slot-scope="scope">{{ scope.row.totalAmount }}</template>
        </el-table-column>
      </el-table>
      <div class="paging">
        <el-pagination class="pages" background layout="total,prev, pager, next, jumper"
                       v-show="depositListPager.total > depositListPager.rows"
                       :total="depositListPager.total"
                       :current-page.sync="depositListPager.page"
                       :pager-count=5
                       :page-size="depositListPager.rows" @current-change="pagesDepositList">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {getLocalTime,divDecimals} from '@/api/util'
  import moment from 'moment'
  import {queryMyHisOrder} from '@/api/requestData'
  import SelectTokenBar from '@/components/SelectTokenBar'
  import SelectBar from '@/components/SelectBar';

  export default {
    data() {
      return {
        address: localStorage.getItem('accountInfo') != null ? JSON.parse(localStorage.getItem('accountInfo')).address : '',
        fromTokenInfo:{},
        toTokenInfo: {},
        //历史委托列表
        depositList: [],
        //历史委托列表分页信息
        depositListPager: {
          total: 0,
          page: 1,
          rows: 15,
        },
        //交易状态
        txStatusOptions: [
          {value: 10, label: '10'},
          {value: 0, label: '0'},
          {value: 1, label: '1'},
          {value: 2, label: '2'},
          {value: 9, label: '9'},
        ],
        status: 10,
        depositTime: '',
        startQueryTime: '',
        endQueryTime: '',
        //历史委托列表加载动画
        depositListLoading: true
      };
    },
    components: {
      SelectTokenBar,
      SelectBar
    },
    created() {
      this.pagesDepositList();
    },
    methods: {
      /**
       * 根据地址获取当前委托列表
       */
      queryMyHisOrderPage(page, rows, address, fromTokenId, toTokenId, status, startQueryTime, endQueryTime) {
          let params = {
              "current": page,
              "pageSize": rows,
              "address": address,
              "fromTokenId": fromTokenId,
              "toTokenId": toTokenId,
              "status": status,
              "startQueryTime": startQueryTime,
              "endQueryTime": endQueryTime
          };
          queryMyHisOrder(params)
              .then((response) => {
                  if (response.success) {
                      for (let item of response.data.records) {
                          //item.createTime = moment(getLocalTime(item.createTime)).format('YYYY-MM-DD HH:mm:ss');
                          item.price = divDecimals(item.price, 8);
                          item.txNum = divDecimals(item.txNum, 8);
                          item.totalNum = divDecimals(item.totalNum, 8);
                          item.totalAmount = divDecimals(item.totalAmount, 8);
                      }
                      this.depositList = response.data.records;
                      this.depositListPager.total = response.data.total;
                      this.depositListLoading = false;
                  } else {
                      this.$message({
                          message: this.$t('public.queryMyHisOrderFail') + response.data,
                          type: 'error',
                          duration: 3000
                      });
                  }
              });
      },
      /**
       * 查询历史委托列表分页
       */
      pagesDepositList() {
        if(this.depositTime) {
          let startTime=this.depositTime[0];
          let endTime=this.depositTime[1];
          this.startQueryTime = moment(getLocalTime(startTime.getTime())).format('YYYY-MM-DD HH:mm:ss');
          this.endQueryTime = moment(getLocalTime(endTime.getTime())).format('YYYY-MM-DD HH:mm:ss');
        }
        if(this.status === 10) {
            status = '';
        }
        this.queryMyHisOrderPage(this.depositListPager.page, this.depositListPager.rows, this.address, this.fromTokenInfo.tokenId, this.toTokenInfo.tokenId, status, this.startQueryTime, this.endQueryTime);
      },

      /**
       * 选择代币类型
       **/
      changeTokenType(fromTokenInfo, toTokenInfo) {
        this.fromTokenInfo = fromTokenInfo;
        this.toTokenInfo = toTokenInfo;
      },

      /**
       *  选择交易状态
       **/
      changeTxStatus(type) {
        this.status = type;
      },

    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .his-order {
    margin: 0px auto 0;
    .bg-white {
      height: 50px;
    }
    .title {
      height: 40px;
      line-height: 40px;
      font-size: 12px;
    }
    .tokenBar{
      float:right;
    }
    .input-class{
      width: 355px !important;
      .el-range-input{
        width: 50%;
      }
    }
    .el-input__inner
    {
      font-size: 12px;
    }
    .tab {
      .tips {
        margin: 40px auto;
        padding: 20px 30px;
        p {
          line-height: 24px;
          i {
            width: 5px;
            height: 5px;
            display: block;
            float: left;
            margin: 9px 10px 0 0;
            border-radius: 5px;
            background: #000000;
          }
        }
      }
      .pass-form {

      }

    }
  }

</style>
