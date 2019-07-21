<template>
  <div class="address-info bg-gray">
    <div class="bg-white">
      <div class="title font24 w1200">
        <el-select v-model="fromTokenId" @change="changeTokenType">
          <el-option v-for="item in fromTokenOptions" :key="item.tokenId" :label="item.tokenSymbol" :value="item.tokenId">
          </el-option>
        </el-select>
          —>
          <el-select v-model="toTokenId">
              <el-option v-for="item in toTokenOptions" :key="item.tokenId" :label="item.tokenSymbol" :value="item.tokenId">
              </el-option>
          </el-select>
      </div>
    </div>
    <div class="top w1200">
      <div class="top-left fl">
        <h3 class="tabs_title tabs_header capitalize">{{$t('tradeAction.tradeAction0')}}</h3>
        <div class="pie fl">
          <el-form>
            <el-form-item prop="price">
              <el-input type="input" v-model="input" aria-placeholder="请设置单价"></el-input>USDT
            </el-form-item>
            <el-form-item prop="txNum">
              <el-input type="input" v-model="input" aria-placeholder="购买数量"></el-input><span>NULS</span>
            </el-form-item>
            <el-form-item prop="userName">
              <el-button type="danger" >买入</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="top-left fl">
        <h3 class="tabs_title tabs_header capitalize">{{$t('tradeAction.tradeAction1')}}</h3>
        <div class="pie fl">

          <div class="a_total">

          </div>
        </div>
      </div>
      <div class="top-right fl">
        <h3 class="tabs_title tabs_header capitalize">{{$t('public.basicInfo')}}</h3>
        <ul class="total_ul">
          <li class="tabs_infos capitalize" v-if="isMobile">{{$t('public.balance')}}
            <span class="fr">{{addressInfo.totalBalance}}</span>
          </li>
          <li class="tabs_infos capitalize" v-if="isMobile">{{$t('public.usablebalance')}}
            <span class="fr">{{addressInfo.balances}}</span>
          </li>
          <li class="tabs_infos capitalize" v-if="isMobile">{{$t('public.consensusLocking')}}
            <span class="fr">{{addressInfo.totalLocks}}</span>
          </li>

          <li class="tabs_infos capitalize">{{$t('public.alias')}}
            <span class="fr">{{addressInfo.alias  ? addressInfo.alias : '-' }}</span>
          </li>
          <li class="tabs_infos capitalize">{{$t('public.transactionNo')}}<span
                  class="fr">{{addressInfo.txCount}}</span></li>
          <li class="tabs_infos capitalize">{{$t('public.address')+$t('public.type')}}<span class="fr">{{$t('addressType.'+addressInfo.type)}}</span>
          </li>
          <li class="tabs_infos capitalize">{{$t('addressList.addressList1')}}<span class="fr">{{addressInfo.totalIn}} NULS</span>
          </li>
          <li class="tabs_infos capitalize">{{$t('addressList.addressList2')}}<span class="fr">{{addressInfo.totalOut}} NULS</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="cb"></div>
    <div class="bottoms w1200 cb">
      <el-tabs v-model="activeName" @tab-click="handleClick">
      </el-tabs>
    </div>
  </div>
</template>

<script>
  //import nuls from 'nuls-sdk-js'
  import moment from 'moment'
  import {getLocalTime, superLong, copys, timesDecimals, Plus} from '@/api/util.js'

  export default {
    data() {
      return {
        isMobile: true,
        activeName: 'addressFirst',
        //交易类型
        typeRegion: 0,
        //地址
        address: this.$route.query.address,
        //地址详情
        addressInfo: [],
        addressNumber: [],
        //交易列表
        txList: [],
        //交易列表分页信息
        txListPager: {
          total: 0,
          page: 1,
          rows: 5,
        },
        //交易列表加载动画
        txListLoading: true,
        //隐藏共识奖励
        hideSwitch: false,
        fromTokenId:'',
        fromTokenOptions:  [{
              'tokenId': 1,
              'tokenSymbol': 'NULS',
              'switchTokenList':[
                  {
                      'tokenId': 2,
                      'tokenSymbol': 'USDT'
                  },
                  {
                      'tokenId': 3,
                      'tokenSymbol': 'ETH'
                  },
                  {
                      'tokenId': 4,
                      'tokenSymbol': 'BTC'
                  }
              ]
        }, {
              'tokenId': 2,
              'tokenSymbol': 'USDT',
            'switchTokenList':[
                {
                    'tokenId': 1,
                    'tokenSymbol': 'NULS'
                },
                {
                    'tokenId': 3,
                    'tokenSymbol': 'ETH'
                },
                {
                    'tokenId': 4,
                    'tokenSymbol': 'BTC'
                }
            ]
        }
        ],
        toTokenId:'',
        toTokenOptions:[],
        tokenOptions:[],
        //token类型
        tokenValue: '',
        //token 交易列表
        tokenList: [],
        //token 交易列表分页信息
        tokenListPager: {
          total: 0,
          page: 1,
          rows: 4,
        },
        //token 交易列表加载动画
        tokenListLoading: true,
        //地址定时器
        addressInterval: null,
      }
    },
    components: {
      //SelectBar
    },
    created() {
      this.isMobile = /(iPhone|iOS|Android|Windows Phone)/i.test(navigator.userAgent);
      this.getAddressInfo(this.address);
      this.pagesTxListList();
    },
    mounted() {
      //延迟加载饼状图
      setTimeout(() => {
        this.chartData = {
          columns: ['location', 'value'],
          rows: this.addressNumber
        };
      }, 500);

      //定时获取地址
      this.addressInterval = setInterval(() => {
        this.address = this.$route.query.address;
      }, 500)
    },
    beforeDestroy() {
      //离开界面清除定时器
      if (this.addressInterval) {
        clearInterval(this.addressInterval);
      }
    },
    methods: {

      /**
       * 复制方法
       * @param sting
       **/
      copy(sting) {
        copys(sting);
        this.$message({message: this.$t('public.copysuccess'), type: 'success', duration: 1000});
      },

      /**
       * 获地址详细信息
       */
      getAddressInfo(address) {
        this.$post('/', 'getAccount', [address])
                .then((response) => {
                  //console.log(response);
                  if (response.hasOwnProperty("result")) {
                    response.result.totalBalance = timesDecimals(response.result.totalBalance, 8);
                    response.result.balances = timesDecimals(response.result.balance, 8);
                    response.result.totalLock = Plus(response.result.timeLock, response.result.consensusLock).toString();
                    response.result.totalLocks = timesDecimals(response.result.totalLock, 8);
                    response.result.timeLock = timesDecimals(response.result.timeLock, 8);
                    response.result.consensusLock = timesDecimals(response.result.consensusLock, 8);
                    response.result.totalIn = timesDecimals(response.result.totalIn, 8);
                    response.result.totalOut = timesDecimals(response.result.totalOut, 8);

                    if (parseInt(response.result.balance) > 0) {
                      this.addressNumber.push({
                        location: this.$t('public.usablebalance'),
                        value: parseInt(timesDecimals(response.result.balance, 8))
                      });
                    }
                    if (parseInt(response.result.totalLock) > 0) {
                      this.addressNumber.push({
                        location: this.$t('public.consensusLocking'),
                        value: parseInt(timesDecimals(response.result.totalLock, 8))
                      });
                    }

                    //循环代币
                    for (let item in response.result.tokens) {
                      this.tokenOptions[item] = response.result.tokens[item].split(',');
                    }
                    this.tokenOptions.unshift(["", this.$t('type.0')]);
                    this.addressInfo = response.result;
                  }
                })
      },

      /**
       * tab 选项
       **/
      handleClick(tab) {
        this.activeName = tab.name;
        if (tab.name === 'addressFirst') {
          this.txListLoading = true;
          this.pagesTxListList();
        } else if (tab.name === 'addressSecond') {
          this.tokenListLoading = true;
          this.pagesTokenList(this.tokenListPager.page, this.tokenListPager.rows, this.address, "")
        }
      },

      /**
       * 根据地址获取交易列表
       */
      getTxListByAddress(page, rows, address, type, boolean) {
        this.$post('/', 'getAccountTxs', [page, rows, address, type, boolean])
                .then((response) => {
                  //console.log(response);
                  if (response.hasOwnProperty("result")) {
                    for (let item of response.result.list) {
                      item.createTime = moment(getLocalTime(item.createTime)).format('YYYY-MM-DD HH:mm:ss');
                      item.txHashs = superLong(item.txHash, 15);
                      item.values = timesDecimals(item.values, 8);
                      item.balance = timesDecimals(item.balance, 8);
                      item.fee = timesDecimals(item.fee, 8);
                    }
                    this.txList = response.result.list;
                    this.txListPager.total = response.result.totalCount;
                    this.txListLoading = false;
                  }
                }).catch((error) => {
          console.log(error)
        })
      },

      /**
       * 根据地址获取交易列表 分页
       */
      pagesTxListList() {
        this.getTxListByAddress(this.txListPager.page, this.txListPager.rows, this.address, this.typeRegion, this.hideSwitch);
      },

      /**
       * 根据地址获取Token交易列表
       */
      getTokenListByAddress(page, rows, address, contractAddress) {
        this.$post('/', 'getTokenTransfers', [page, rows, address, contractAddress])
                .then((response) => {
                  //console.log(response);
                  if (response.hasOwnProperty("result")) {
                    // for (let item of response.result.list) {
                    //   item.createTime = moment(getLocalTime(item.time)).format('YYYY-MM-DD HH:mm:ss');
                    //   item.fromAddresss = superLong(item.fromAddress, 6);
                    //   item.toAddresss = superLong(item.toAddress, 6);
                    //   item.value = timesDecimals(item.value, item.decimals);
                    //   item.fromBalance = timesDecimals(item.fromBalance, item.decimals);
                    //   item.toBalance = timesDecimals(item.toBalance, item.decimals);
                    //   item.txHashs = superLong(item.txHash, 10);
                    //   item.showValue = this.address === item.toAddress;
                    // }
                    this.tokenList = response.result.list;
                    this.tokenListPager.total = response.result.totalCount;
                    this.tokenListLoading = false;
                  }
                }).catch((error) => {
          console.log(error)
        })
      },

      /**
       * 根据地址获取Token交易列表分页
       */
      pagesTokenList() {
        this.getTokenListByAddress(this.tokenListPager.page, this.tokenListPager.rows, this.address, this.tokenValue);
      },

      /**
       * 选择代币类型
       **/
      changeToken() {
        this.getTokenListByAddress(this.tokenListPager.page, this.tokenListPager.rows, this.address, this.tokenValue);
      },

        changeTokenType()
        {
            console.log("size: "+this.fromTokenOptions.length)
            //循环fromTokenOptions数组
            for(let i = 0;i<this.fromTokenOptions.length;i++){
                //如果当前点击的数组value等于他自己当前v-model
                console.log("fromtokenid: "+this.fromTokenId);
                console.log("for fid: "+this.fromTokenOptions[i].tokenId)
                if(this.fromTokenOptions[i].tokenId == this.fromTokenId){
                    //就把数组label绑定le2list
                    console.log(this.fromTokenOptions[i].switchTokenList)
                    this.toTokenOptions = this.fromTokenOptions[i].switchTokenList;
                }
            }
        },

      /**
       * url 连接跳转
       * @param name
       * @param parmes
       */
      toUrl(name, parmes) {
        let newParmes = {};
        if (name === 'addressInfo') {
          this.address = parmes;
          newParmes = {address: parmes}
        } else if (name === 'blockInfo') {
          newParmes = {height: parmes}
        } else if (name === 'contractsInfo') {
          newParmes = {contractAddress: parmes, tabName: 'first'}
        } else if (name === 'tokenInfo') {
          newParmes = {contractAddress: parmes}
        }
        else {
          newParmes = {hash: parmes}
        }
        this.$router.push({
          name: name,
          query: newParmes
        })

      },

      /**
       * 获取交易类型
       **/
      changeType(type) {
        this.txListLoading = true;
        this.typeRegion = parseInt(type);
        this.getTxListByAddress(this.txListPager.page, this.txListPager.rows, this.address, this.typeRegion, this.hideSwitch);
      },

      /**
       * 隐藏共识奖励
       */
      hideConsensusList() {
        this.txListLoading = true;
        this.getTxListByAddress(this.txListPager.page, this.txListPager.rows, this.address, this.typeRegion, this.hideSwitch);
      },

    },

    watch: {
      address: function () {
        // address，当放生变化时，重新获取数据
        this.activeName = 'addressFirst';
        this.addressNumber = [];
        this.txListLoading = true;
        this.getAddressInfo(this.address);
        this.pagesTxListList();

        //延迟加载饼状图
        setTimeout(() => {

        }, 500);
      }
    }
  }
</script>

<style lang="less">
  @import "./../../assets/css/style";

  .address-info {
    //min-height: 800px;
    margin-bottom: 10px;
    .bg-white {
        height: 100px;
      .title {
        padding-bottom: 0px;
        margin: 0px auto 0;
        .click {
          margin-left: 20px;
        }
        @media screen and (max-width: 1000px) {
          padding: 0 0 1.8rem 0.5rem;
          font-size: 0.9rem;
          .click {
            margin-left: 1rem;
            font-size: 0.9rem;
          }
        }
      }
    }
    .top {
      margin: -24px auto 0;
      height: 255px;
      @media screen and (max-width: 1000px) {
        height: auto;
      }
      .top-left {
        width: 300px;
        height: 255px;
        border: @BD1;
        border-radius: 3px;
        background-color: @Bcolour1;
        @media screen and (max-width: 1000px) {
          width: 95%;
          height: auto;
        }
        .tabs_title {
          padding: 0 0 0 0px;
          text-align: center;
        }
        .tabs_header{
          background: #F5F6F8;
          font-size: 16px;
          font-weight: 700;
          color: #475472;
        }
      }
      .top-right {
        width: 550px;
        height: 255px;
        border: @BD1;
        border-radius: 3px;
        background-color: @Bcolour1;
        @media screen and (max-width: 1000px) {
          width: 95%;
          height: auto;
        }
        .tabs_title {
          padding: 0 0 0 30px;
        }
      }
      .top-left {
        @media screen and (max-width: 1000px) {
          display: none;
        }
      }
      .top-right {
        margin: 0 0 0 20px;
        @media screen and (max-width: 1000px) {
          margin: 0 0 0 2.5%;
        }
        .total_ul {
          margin: 0 20px;
          li {
            border-bottom: @BD1;
            padding: 0 10px;
            color: @Acolor3;
            &:last-child {
              border-bottom: 0
            }
            span {
              color: @Mcolour;
            }
            .click {
              color: @Ccolour;
            }
          }
        }
      }
    }

    .bottoms {
      margin: 30px auto 14px;
      @media screen and (max-width: 1000px) {
        margin: 1.5rem auto 1.5rem ;
        width: 95%;
      }
      .el-icon-download {
        margin-left: 10px;
        font-size: 20px;
      }
      .hide-switch {
        margin: 10px 0 0 0;
        @media screen and (max-width: 1000px) {
          margin: 0.5rem 0.5rem 0 0;
        }
      }
    }
  }
</style>
